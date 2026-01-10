"use client";

import { useState, useMemo, useEffect } from "react";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  ChevronLeft,
  Wallet,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  X,
} from "lucide-react";
import { apiController } from "@/lib/apiController";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./payment-form";
import { Service } from "../braiders-components/types/braider";
import { useInitiateBooking } from "./hooks/use-booking";
import { useWalletBalance } from "./hooks/use-wallet";
import { useSession } from "next-auth/react";
import LoginModal from "../auth/login-modal";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  braiderId: string;
  service: Service | null;
  initialDate?: string | null;
}

type Step = "CUSTOMIZE" | "SCHEDULE" | "PAYMENT" | "SUCCESS";

const formatPrice = (amount: number | string) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(numericAmount || 0);
};

export default function BookingModal({
  isOpen,
  onClose,
  braiderId,
  service,
  initialDate,
}: BookingModalProps) {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate) {
      const parsed = parseISO(initialDate);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  });

  const [step, setStep] = useState<Step>("CUSTOMIZE");

  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);

  const [paymentData, setPaymentData] = useState<{
    clientSecret?: string;
    amountStripe: number;
    amountTotal: number;
  } | null>(null);

  const { mutate: initiateBooking, isPending: isBookingLoading } =
    useInitiateBooking();

  const { data: wallet, isLoading: isWalletLoading } = useWalletBalance(
    isOpen && step === "SCHEDULE" && !!session
  );

  const { data: availableSlots = [], isFetching: isSlotsFetching } = useQuery({
    queryKey: ["availability", braiderId, format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await apiController<{ data: string[] }>({
        method: "GET",
        url: `/braiders/public/${braiderId}/availability/?date=${dateStr}`,
      });
      return res.data;
    },
    enabled: step === "SCHEDULE" && isOpen,
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });

  const timeGroups = useMemo(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    for (let i = 6; i <= 23; i++) {
      const hourStr = i.toString().padStart(2, "0");
      const slot1 = `${hourStr}:00`;
      const slot2 = `${hourStr}:30`;
      const targetArray = i < 12 ? morning : i < 17 ? afternoon : evening;
      targetArray.push(slot1);
      targetArray.push(slot2);
    }

    return { morning, afternoon, evening };
  }, []);

  const totalCost = useMemo(() => {
    if (!service) return 0;
    let total = parseFloat(service.base_price);
    service.variations.forEach((v) => {
      if (selectedVariations.includes(v.id)) {
        total += parseFloat(v.price_adjustment);
      }
    });
    return total;
  }, [service, selectedVariations]);

  const amountToPay = useMemo(() => {
    if (!useWallet || !wallet) return totalCost;
    return Math.max(0, totalCost - wallet.balance);
  }, [totalCost, useWallet, wallet]);

  useEffect(() => {
    if (wallet && wallet.balance <= 0 && useWallet) {
      setUseWallet(false);
    }
  }, [wallet, useWallet]);

  const handleNext = () => {
    if (step === "CUSTOMIZE") {
      setStep("SCHEDULE");
    } else if (step === "SCHEDULE") {
      if (!selectedTime) return toast.error("Please select a time slot");
      if (!service) return;

      if (!session) {
        setShowLoginModal(true);
        return;
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const startTimeISO = `${dateStr}T${selectedTime}:00`;

      const payload = {
        service_id: service.id,
        variation_ids: selectedVariations,
        start_time: startTimeISO,
        use_wallet: useWallet,
      };

      initiateBooking(payload, {
        onSuccess: (response) => {
          const data = response.data;
          if (data.amount_stripe === 0) {
            setStep("SUCCESS");
          } else if (data.client_secret) {
            setPaymentData({
              clientSecret: data.client_secret,
              amountStripe: data.amount_stripe,
              amountTotal: data.amount_total,
            });
            setStep("PAYMENT");
          }
        },
        onError: (err: Error) => {
          const msg = err.message || "Booking failed";
          toast.error(msg);
        },
      });
    }
  };

  const handleBack = () => {
    if (step === "SCHEDULE") setStep("CUSTOMIZE");
    if (step === "PAYMENT") setStep("SCHEDULE");
  };

  const resetAndClose = () => {
    setStep("CUSTOMIZE");
    setSelectedVariations([]);
    setSelectedTime(null);
    setPaymentData(null);
    setUseWallet(false);
    onClose();
  };

  if (!service) return null;

  const hasBalance = wallet ? wallet.balance > 0 : false;
  const fullyCovered =
    hasBalance && wallet ? wallet.balance >= totalCost : false;

  const renderTimeGroup = (
    title: string,
    icon: React.ReactNode,
    slots: string[]
  ) => {
    return (
      <div className="mb-6 last:mb-0">
        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          {icon} {title}
        </h5>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {slots.map((slot) => {
            const isAvailable = availableSlots.includes(slot);
            const isSelected = selectedTime === slot;
            return (
              <button
                key={slot}
                onClick={() => isAvailable && setSelectedTime(slot)}
                disabled={!isAvailable}
                className={`
                  h-11 text-sm font-medium rounded-xl transition-all duration-200 border flex items-center justify-center
                  ${
                    isSelected
                      ? "bg-[#D0865A] text-white border-[#D0865A] shadow-md scale-105 z-10 font-bold"
                      : isAvailable
                      ? "bg-white text-gray-700 border-gray-200 hover:border-[#D0865A] hover:bg-[#D0865A]/5 hover:text-[#D0865A]"
                      : "bg-red-50 text-red-400 border-red-100 cursor-not-allowed shadow-none"
                  }
                `}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
        <DialogContent className="sm:max-w-lg w-full p-0 gap-0 overflow-hidden rounded-2xl bg-white max-h-[95vh] flex flex-col">
          <button
            onClick={resetAndClose}
            className="absolute right-4 top-4 z-50 p-2 bg-gray-100/50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <DialogHeader className="p-4 sm:p-5 border-b border-gray-100 bg-white z-20 shrink-0">
            <div className="flex items-center gap-3">
              {step !== "CUSTOMIZE" && step !== "SUCCESS" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-9 w-9 p-0 -ml-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                {step === "CUSTOMIZE" && "Customize Style"}
                {step === "SCHEDULE" && "Select Date & Time"}
                {step === "PAYMENT" && "Complete Payment"}
                {step === "SUCCESS" && "Booking Confirmed"}
              </DialogTitle>
            </div>
            <DialogDescription className="hidden">
              Booking Wizard
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto bg-white">
            <div className="p-4 sm:p-6 pb-32">
              {/* STEP 1: CUSTOMIZE */}
              {step === "CUSTOMIZE" && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-xl text-gray-900">
                      {service.skill_name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-900 shadow-sm">
                        {formatPrice(service.base_price)}
                      </span>
                      <span className="text-gray-400 text-xs uppercase tracking-wide font-medium">
                        Base Price
                      </span>
                    </div>
                  </div>

                  {service.variations.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 px-1">
                        Add-ons & Variations
                      </h4>
                      {service.variations.map((variant) => (
                        <div
                          key={variant.id}
                          className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200
                          ${
                            selectedVariations.includes(variant.id)
                              ? "bg-[#D0865A]/5 border-[#D0865A] shadow-sm"
                              : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-300"
                          }
                        `}
                          onClick={() => {
                            if (selectedVariations.includes(variant.id)) {
                              setSelectedVariations(
                                selectedVariations.filter(
                                  (id) => id !== variant.id
                                )
                              );
                            } else {
                              setSelectedVariations([
                                ...selectedVariations,
                                variant.id,
                              ]);
                            }
                          }}
                        >
                          <Checkbox
                            id={variant.id}
                            checked={selectedVariations.includes(variant.id)}
                            onCheckedChange={() => {}}
                            className="data-[state=checked]:bg-[#D0865A] data-[state=checked]:border-[#D0865A] w-5 h-5 border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span
                                className={`font-medium ${
                                  selectedVariations.includes(variant.id)
                                    ? "text-[#D0865A]"
                                    : "text-gray-700"
                                }`}
                              >
                                {variant.name}
                              </span>
                              <span className="font-semibold text-gray-900">
                                +{formatPrice(variant.price_adjustment)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 uppercase mt-0.5 tracking-wide">
                              {variant.category}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: SCHEDULE */}
              {step === "SCHEDULE" && (
                <div className="space-y-8">
                  {/* CALENDAR */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      className="w-full max-w-[350px]"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4 w-full",
                        caption:
                          "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-base font-bold text-gray-900",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full justify-between mb-2",
                        head_cell:
                          "text-gray-400 rounded-md w-9 font-medium text-[0.8rem] uppercase tracking-wider flex justify-center",
                        row: "flex w-full mt-2 justify-between",
                        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#D0865A]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center justify-center text-gray-700",
                        day_selected:
                          "bg-[#D0865A] !text-white hover:bg-[#D0865A] hover:text-white shadow-md shadow-orange-500/30 font-bold",
                        day_today:
                          "bg-gray-100 text-gray-900 font-bold border border-gray-200",
                        day_outside: "text-gray-300 opacity-50",
                        day_disabled: "text-gray-300 opacity-50",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>

                  {/* WALLET TOGGLE */}
                  {session && (
                    <div
                      className={`
                    flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                    ${
                      hasBalance
                        ? "bg-[#FDF8F6] border-[#D0865A]/30 shadow-sm"
                        : "bg-gray-50 border-gray-200"
                    }
                  `}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl flex items-center justify-center ${
                            hasBalance
                              ? "bg-[#D0865A] text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p
                              className={`font-semibold text-sm ${
                                hasBalance ? "text-gray-900" : "text-gray-500"
                              }`}
                            >
                              Pay with Wallet
                            </p>
                            {fullyCovered && useWallet && (
                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                                Covered
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 font-medium">
                            {isWalletLoading ? (
                              <span className="animate-pulse">Loading...</span>
                            ) : (
                              <>
                                Balance:{" "}
                                <span
                                  className={
                                    hasBalance ? "text-[#D0865A] font-bold" : ""
                                  }
                                >
                                  {wallet?.formatted || "€0.00"}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={useWallet}
                        onCheckedChange={setUseWallet}
                        disabled={!hasBalance || isWalletLoading}
                        className="data-[state=checked]:bg-[#D0865A]"
                      />
                    </div>
                  )}

                  {/* TIME SLOTS */}
                  <div>
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-100/50">
                      <h4 className="font-bold text-lg text-gray-900">
                        Select Time
                      </h4>
                      {isSlotsFetching ? (
                        <span className="text-xs text-[#D0865A] flex items-center gap-1 bg-[#D0865A]/10 px-2 py-1 rounded-full animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin" /> Updating
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          {format(selectedDate, "EEE, MMM do")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {renderTimeGroup(
                        "Morning",
                        <Sun className="w-4 h-4 text-orange-400" />,
                        timeGroups.morning
                      )}
                      {renderTimeGroup(
                        "Afternoon",
                        <Sunset className="w-4 h-4 text-orange-500" />,
                        timeGroups.afternoon
                      )}
                      {renderTimeGroup(
                        "Evening",
                        <Moon className="w-4 h-4 text-indigo-400" />,
                        timeGroups.evening
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === "PAYMENT" &&
                paymentData &&
                paymentData.clientSecret && (
                  <div className="space-y-6">
                    <div className="bg-[#FAF3EF] p-5 rounded-2xl border border-[#D0865A]/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm font-medium">
                          Booking Total
                        </span>
                        <span className="font-bold text-gray-900 text-lg">
                          {formatPrice(paymentData.amountTotal)}
                        </span>
                      </div>

                      {paymentData.amountTotal > paymentData.amountStripe && (
                        <div className="flex justify-between items-center mb-3 text-sm pb-3 border-b border-[#D0865A]/10">
                          <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                            <Wallet className="w-3.5 h-3.5" /> Wallet Credit
                          </span>
                          <span className="text-green-600 font-bold">
                            -
                            {formatPrice(
                              paymentData.amountTotal - paymentData.amountStripe
                            )}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-900 font-bold text-lg">
                          Pay Now
                        </span>
                        <span className="text-2xl font-black text-[#D0865A] tracking-tight">
                          {formatPrice(paymentData.amountStripe)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-1 border border-gray-200 rounded-xl">
                        <Elements
                          stripe={stripePromise}
                          options={{
                            clientSecret: paymentData.clientSecret,
                            appearance: {
                              theme: "stripe",
                              variables: {
                                colorPrimary: "#D0865A",
                                borderRadius: "10px",
                                fontFamily: "system-ui, sans-serif",
                                spacingUnit: "4px",
                              },
                            },
                          }}
                        >
                          <PaymentForm
                            amount={paymentData.amountStripe}
                            onSuccess={() => setStep("SUCCESS")}
                          />
                        </Elements>
                      </div>

                      <div className="flex justify-center items-center gap-2 mt-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          Powered by
                        </span>
                        <Image
                          src="/stripe/stripe.webp"
                          alt="Stripe"
                          width={40}
                          height={20}
                          className="h-5 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                )}

              {/* STEP 4: SUCCESS */}
              {step === "SUCCESS" && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-500 shadow-sm border border-green-100">
                    <ShieldCheck className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Booking Confirmed!
                    </h3>
                    <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                      Your appointment is set for <br />
                      <span className="font-semibold text-gray-900">
                        {format(selectedDate, "MMM d, yyyy")}
                      </span>{" "}
                      at{" "}
                      <span className="font-semibold text-gray-900">
                        {selectedTime}
                      </span>
                    </p>
                    <p>
                      Kindly check your mail for your reciept, thank you for
                      choosing us!
                    </p>
                  </div>
                  <Button
                    onClick={resetAndClose}
                    className="bg-gray-900 hover:bg-black text-white w-full rounded-xl h-12 text-base shadow-lg font-medium"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* FOOTER (Sticky) */}
          {(step === "CUSTOMIZE" || step === "SCHEDULE") && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-white shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">
                  {useWallet && wallet && wallet.balance > 0
                    ? "Amount to Pay"
                    : "Estimated Total"}
                </span>
                <div className="text-right">
                  {useWallet &&
                    wallet &&
                    wallet.balance > 0 &&
                    amountToPay < totalCost && (
                      <span className="text-xs text-gray-400 line-through mr-2 font-medium">
                        {formatPrice(totalCost)}
                      </span>
                    )}
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    {formatPrice(amountToPay)}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleNext}
                disabled={
                  isBookingLoading || (step === "SCHEDULE" && !selectedTime)
                }
                className="w-full h-12 sm:h-14 bg-[#D0865A] hover:bg-[#bf764a] text-white text-lg rounded-xl shadow-lg shadow-orange-500/20 font-bold active:scale-[0.98] transition-transform"
              >
                {isBookingLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : step === "SCHEDULE" ? (
                  "Continue to Payment"
                ) : (
                  "Select Date & Time"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
