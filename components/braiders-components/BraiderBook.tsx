"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  ChevronLeft,
  Wallet,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { apiController } from "@/lib/apiController";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/booking/payment-form";
import { BraiderProfileData } from "@/components/braiders-components/types/braider";
import { useInitiateBooking } from "@/components/booking/hooks/use-booking";
import { useWalletBalance } from "@/components/booking/hooks/use-wallet";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

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

function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.warn("Error reading sessionStorage", error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.warn("Error setting sessionStorage", error);
      }
    },
    [key],
  );

  return [storedValue, setValue, isMounted] as const;
}

export default function BraiderBook() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const braiderId = params.id as string;
  const serviceId = searchParams.get("serviceId");
  const initialDate = searchParams.get("date");

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["braider", braiderId],
    queryFn: async () => {
      const res = await apiController<{ data: BraiderProfileData }>({
        method: "GET",
        url: `/customers/braiders/${braiderId}/`,
      });
      return res.data;
    },
    enabled: !!braiderId,
  });

  const service = useMemo(
    () => profile?.services.find((s) => s.id === serviceId) || null,
    [profile, serviceId],
  );

  const storageKey = `booking_${braiderId}_${serviceId}`;
  const [step, setStep, isMounted] = useSessionStorage<Step>(
    `${storageKey}_step`,
    "CUSTOMIZE",
  );
  const [selectedVariations, setSelectedVariations] = useSessionStorage<
    string[]
  >(`${storageKey}_vars`, []);
  const [selectedDateStr, setSelectedDateStr] = useSessionStorage<string>(
    `${storageKey}_date`,
    initialDate || new Date().toISOString(),
  );
  const [selectedTime, setSelectedTime] = useSessionStorage<string | null>(
    `${storageKey}_time`,
    null,
  );
  const [useWallet, setUseWallet] = useSessionStorage<boolean>(
    `${storageKey}_wallet`,
    false,
  );

  useEffect(() => {
    if (step === "SUCCESS") {
      sessionStorage.removeItem(`${storageKey}_step`);
      sessionStorage.removeItem(`${storageKey}_vars`);
      sessionStorage.removeItem(`${storageKey}_date`);
      sessionStorage.removeItem(`${storageKey}_time`);
      sessionStorage.removeItem(`${storageKey}_wallet`);
    }
  }, [step, storageKey]);

  const clearBookingSession = () => {
    sessionStorage.removeItem(`${storageKey}_step`);
    sessionStorage.removeItem(`${storageKey}_vars`);
    sessionStorage.removeItem(`${storageKey}_date`);
    sessionStorage.removeItem(`${storageKey}_time`);
    sessionStorage.removeItem(`${storageKey}_wallet`);
  };

  const selectedDate = useMemo(() => {
    const d = new Date(selectedDateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [selectedDateStr]);

  const [calendarMonth, setCalendarMonth] = useState<Date>(selectedDate);

  useEffect(() => {
    if (initialDate) {
      const parsed = new Date(initialDate);
      if (!isNaN(parsed.getTime())) {
        setSelectedDateStr(parsed.toISOString());
        setCalendarMonth(parsed);
      }
    }
  }, [initialDate, setSelectedDateStr]);

  const [paymentData, setPaymentData] = useState<{
    clientSecret?: string;
    amountStripe: number;
    amountTotal: number;
  } | null>(null);

  const { mutate: initiateBooking, isPending: isBookingLoading } =
    useInitiateBooking();
  const { data: wallet, isLoading: isWalletLoading } = useWalletBalance(
    step === "SCHEDULE" && !!session,
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
    enabled: step === "SCHEDULE" && isMounted,
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });

  const timeGroups = useMemo(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];
    for (let i = 6; i <= 23; i++) {
      const hourStr = i.toString().padStart(2, "0");
      morning.push(`${hourStr}:00`);
      morning.push(`${hourStr}:30`);
      if (i >= 12 && i < 17) {
        afternoon.push(...morning.splice(-2));
      }
      if (i >= 17) {
        evening.push(...morning.splice(-2));
      }
    }
    return { morning, afternoon, evening };
  }, []);

  const totalCost = useMemo(() => {
    if (!service) return 0;
    let total = parseFloat(service.base_price);
    service.variations.forEach((v) => {
      if (selectedVariations.includes(v.id))
        total += parseFloat(v.price_adjustment);
    });
    return total;
  }, [service, selectedVariations]);

  const amountToPay = useMemo(() => {
    if (!useWallet || !wallet) return totalCost;
    return Math.max(0, totalCost - wallet.balance);
  }, [totalCost, useWallet, wallet]);

  const handleNext = () => {
    if (step === "CUSTOMIZE") {
      setStep("SCHEDULE");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === "SCHEDULE") {
      if (!selectedTime) return toast.error("Please select a time slot");

      if (sessionStatus === "unauthenticated") {
        sessionStorage.setItem("auth_intent", "login");
        const currentUrl = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        router.push(`/auth/login?callbackUrl=${currentUrl}`);
        return;
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const startTimeISO = `${dateStr}T${selectedTime}:00`;

      initiateBooking(
        {
          service_id: service!.id,
          variation_ids: selectedVariations,
          start_time: startTimeISO,
          use_wallet: useWallet,
        },
        {
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
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
          onError: (err: Error) => toast.error(err.message || "Booking failed"),
        },
      );
    }
  };

  const handleBack = () => {
    if (step === "SCHEDULE") setStep("CUSTOMIZE");
    if (step === "PAYMENT") setStep("SCHEDULE");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isMounted || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D0865A]" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {step !== "SUCCESS" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                step === "CUSTOMIZE" ? router.back() : handleBack()
              }
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {step === "CUSTOMIZE" && "Customize Style"}
              {step === "SCHEDULE" && "Select Date & Time"}
              {step === "PAYMENT" && "Complete Payment"}
              {step === "SUCCESS" && "Booking Confirmed"}
            </h1>
            {profile && (
              <p className="text-sm text-gray-500 hidden sm:block">
                Booking with {profile.business_name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-7 xl:col-span-8">
            {step === "CUSTOMIZE" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-2xl text-gray-900">
                    {service.skill_name}
                  </h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {service.variations.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      Add-ons & Variations
                    </h4>
                    <div className="grid gap-4">
                      {service.variations.map((variant) => (
                        <label
                          key={variant.id}
                          className={`flex items-center space-x-4 p-5 border rounded-2xl cursor-pointer transition-all duration-200
                          ${selectedVariations.includes(variant.id) ? "bg-[#D0865A]/5 border-[#D0865A] shadow-sm ring-1 ring-[#D0865A]/20" : "bg-white border-gray-200 hover:border-[#D0865A]/50"}`}
                        >
                          <Checkbox
                            checked={selectedVariations.includes(variant.id)}
                            onCheckedChange={(checked) => {
                              setSelectedVariations((prev) =>
                                checked
                                  ? [...prev, variant.id]
                                  : prev.filter((id) => id !== variant.id),
                              );
                            }}
                            className="data-[state=checked]:bg-[#D0865A] data-[state=checked]:border-[#D0865A] w-5 h-5 rounded-md"
                          />
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <span
                                className={`font-semibold block ${selectedVariations.includes(variant.id) ? "text-[#D0865A]" : "text-gray-900"}`}
                              >
                                {variant.name}
                              </span>
                              <span className="text-xs text-gray-500 uppercase tracking-wider">
                                {variant.category}
                              </span>
                            </div>
                            <span className="font-bold text-gray-900">
                              +{formatPrice(variant.price_adjustment)}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === "SCHEDULE" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDateStr(date.toISOString());
                        setSelectedTime(null);
                        setCalendarMonth(date);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    className="w-full max-w-md"
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h4 className="font-bold text-xl text-gray-900">
                      Select Time
                    </h4>
                    {isSlotsFetching ? (
                      <span className="text-sm text-[#D0865A] flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 font-medium">
                        {format(selectedDate, "EEEE, MMMM do")}
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        label: "Morning",
                        icon: <Sun className="w-5 h-5 text-orange-400" />,
                        slots: timeGroups.morning,
                      },
                      {
                        label: "Afternoon",
                        icon: <Sunset className="w-5 h-5 text-orange-500" />,
                        slots: timeGroups.afternoon,
                      },
                      {
                        label: "Evening",
                        icon: <Moon className="w-5 h-5 text-indigo-400" />,
                        slots: timeGroups.evening,
                      },
                    ].map((group) => (
                      <div key={group.label}>
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          {group.icon} {group.label}
                        </h5>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {group.slots.map((slot) => {
                            const isAvailable = availableSlots.includes(slot);
                            const isSelected = selectedTime === slot;
                            return (
                              <button
                                key={slot}
                                onClick={() =>
                                  isAvailable && setSelectedTime(slot)
                                }
                                disabled={!isAvailable}
                                className={`h-12 text-sm font-medium rounded-xl transition-all border flex items-center justify-center ${
                                  isSelected
                                    ? "bg-[#D0865A] text-white border-[#D0865A] shadow-md font-bold"
                                    : isAvailable
                                      ? "bg-white text-gray-700 border-gray-200 hover:border-[#D0865A] hover:bg-orange-50"
                                      : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "PAYMENT" && paymentData?.clientSecret && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 animate-in fade-in duration-500">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentData.clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#D0865A",
                        borderRadius: "10px",
                      },
                    },
                  }}
                >
                  <PaymentForm
                    amount={paymentData.amountStripe}
                    onSuccess={() => {
                      setStep("SUCCESS");
                    }}
                  />
                </Elements>
              </div>
            )}

            {step === "SUCCESS" && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-500 mb-8 max-w-md text-lg">
                  Your appointment is set for{" "}
                  <strong className="text-gray-900">
                    {format(selectedDate, "MMM d, yyyy")}
                  </strong>{" "}
                  at <strong className="text-gray-900">{selectedTime}</strong>.
                </p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full max-w-sm h-14 bg-gray-900 hover:bg-black text-white rounded-xl text-lg font-medium"
                >
                  View My Bookings
                </Button>
              </div>
            )}
          </div>

          {/* Sticky Summary Cart (Hidden on Success) */}
          {step !== "SUCCESS" && (
            <div className="lg:col-span-5 xl:col-span-4 relative">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-lg text-gray-900 mb-4 pb-4 border-b border-gray-100">
                  Booking Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium">
                      {service.skill_name}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {formatPrice(service.base_price)}
                    </span>
                  </div>
                  {service.variations
                    .filter((v) => selectedVariations.includes(v.id))
                    .map((variant) => (
                      <div
                        key={variant.id}
                        className="flex justify-between items-start text-sm"
                      >
                        <span className="text-gray-500 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-[1px] before:bg-gray-300">
                          {variant.name}
                        </span>
                        <span className="text-gray-700">
                          +{formatPrice(variant.price_adjustment)}
                        </span>
                      </div>
                    ))}
                </div>

                {step === "SCHEDULE" && selectedTime && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Scheduled for:</p>
                    <p className="font-semibold text-gray-900">
                      {format(selectedDate, "EEEE, MMMM do, yyyy")}
                    </p>
                    <p className="font-bold text-[#D0865A]">{selectedTime}</p>
                  </div>
                )}

                {session && step !== "CUSTOMIZE" && (
                  <div className="mb-6 py-4 border-t border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Pay with Wallet
                          </p>
                          <p className="text-xs text-gray-500">
                            Balance:{" "}
                            <span className="font-bold">
                              {wallet?.formatted || "€0.00"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={useWallet}
                        onCheckedChange={setUseWallet}
                        disabled={!wallet || wallet.balance <= 0}
                        className="data-[state=checked]:bg-[#D0865A]"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-end pt-4 border-t border-gray-100 mb-6">
                  <span className="text-gray-600 font-medium">Total (EUR)</span>
                  <div className="text-right">
                    {useWallet &&
                      wallet &&
                      wallet.balance > 0 &&
                      amountToPay < totalCost && (
                        <span className="text-sm text-gray-400 line-through mr-2 font-medium">
                          {formatPrice(totalCost)}
                        </span>
                      )}
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">
                      {formatPrice(amountToPay)}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <Button
                    onClick={handleNext}
                    disabled={
                      isBookingLoading ||
                      (step === "SCHEDULE" && !selectedTime) ||
                      step === "PAYMENT"
                    }
                    className="w-full h-14 bg-[#D0865A] hover:bg-[#bf764a] text-white text-lg rounded-xl shadow-lg shadow-orange-500/20 font-bold"
                  >
                    {isBookingLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : step === "CUSTOMIZE" ? (
                      "Continue to Schedule"
                    ) : step === "SCHEDULE" ? (
                      "Proceed to Payment"
                    ) : (
                      "Payment in Progress"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {step !== "SUCCESS" && step !== "PAYMENT" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40 pb-safe shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500 font-medium text-sm">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(amountToPay)}
            </span>
          </div>
          <Button
            onClick={handleNext}
            disabled={
              isBookingLoading || (step === "SCHEDULE" && !selectedTime)
            }
            className="w-full h-14 bg-[#D0865A] hover:bg-[#bf764a] text-white text-lg rounded-xl font-bold shadow-lg shadow-orange-500/20"
          >
            {isBookingLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : step === "CUSTOMIZE" ? (
              "Continue to Schedule"
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
