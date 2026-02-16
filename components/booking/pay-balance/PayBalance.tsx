"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentForm from "@/components/booking/payment-form";
import { usePayBalance } from "./usePayBalance";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const formatPrice = (amount: number | string) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(numericAmount || 0);
};

export default function PayBalance() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const { status } = useSession();
  const { mutate: generatePaymentIntent, isPending } = usePayBalance();

  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    amountDue: number;
  } | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/pay-balance/${bookingId}`);
      return;
    }

    if (status === "authenticated" && bookingId && !isInitialized.current) {
      isInitialized.current = true;

      generatePaymentIntent(bookingId, {
        onSuccess: (res) => {
          setPaymentData({
            clientSecret: res.data.client_secret,
            amountDue: res.data.amount_due,
          });
        },
        onError: (err: Error) => {
          let displayError =
            err.message || "Unable to load payment details. Please try again.";

          if (displayError.toLowerCase().includes("not found")) {
            displayError =
              "We couldn't find this booking. It may belong to another account or has been removed.";
          }
          setError(displayError);
        },
      });
    }
  }, [status, bookingId, generatePaymentIntent, router]);

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
        <p className="text-gray-500 mb-6">Booking reference is missing.</p>
        <Button onClick={() => router.push("/bookings")} variant="outline">
          Return to Bookings
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mb-8">
            Your remaining balance has been paid successfully. Your appointment
            is fully confirmed.
          </p>
          <Button
            onClick={() => router.push("/bookings")}
            className="w-full h-12 bg-[#D0865A] hover:bg-[#bf764a] text-white rounded-xl text-base font-semibold transition-all"
          >
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Bookings
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#170D07] p-8 text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-7 h-7 text-[#D0865A]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Pay Balance</h1>
            <p className="text-white/80 text-sm">
              Complete the remaining payment for your appointment.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="flex flex-col items-center text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                <p className="text-sm font-medium text-red-800 mb-4">{error}</p>
                <Button
                  onClick={() => router.push("/bookings")}
                  variant="outline"
                  className="bg-white"
                >
                  Return to Bookings
                </Button>
              </div>
            )}

            {isPending && !error && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#D0865A]" />
                <p className="text-sm font-medium animate-pulse">
                  Securely connecting to payment provider...
                </p>
              </div>
            )}

            {paymentData?.clientSecret && !error && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Amount Due
                  </span>
                  <span className="text-4xl font-bold text-gray-900 tracking-tight">
                    {formatPrice(paymentData.amountDue)}
                  </span>
                </div>

                <div className="relative">
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
                      amount={paymentData.amountDue}
                      onSuccess={() => setIsSuccess(true)}
                    />
                  </Elements>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Payments are secure and encrypted
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
