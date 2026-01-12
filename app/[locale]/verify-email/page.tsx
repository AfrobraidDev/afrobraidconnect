"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { apiController } from "@/lib/apiController";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import Button from "@/components/generics/Button";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function VerifyEmailPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const hasCalledApi = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasCalledApi.current) return;
      hasCalledApi.current = true;

      if (!token) {
        setStatus("error");
        setErrorMessage(t("invalidToken"));
        return;
      }

      try {
        await apiController({
          method: "GET",
          url: `/auth/verify-email/?token=${token}`,
        });
        setStatus("success");
      } catch (error: unknown) {
        console.error("Verification Error:", error);
        setStatus("error");

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(t("verificationErrorText"));
        }
      }
    };

    verifyToken();
  }, [token, t]);

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 text-center">
        {status === "loading" && (
          <div className="animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Loader2 className="w-10 h-10 text-[#D0865A] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("verifyingEmailTitle")}
            </h1>
            <p className="text-gray-500">{t("verifyingEmailText")}</p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t("verificationSuccessTitle")}
            </h1>
            <p className="text-gray-600 max-w-md mb-8">
              {t("verificationSuccessText")}
            </p>
            <div className="w-full max-w-xs mx-auto">
              <Button
                variant="primary"
                onClick={() => router.push("/auth/login")}
                className="w-full"
              >
                {t("loginNow")}
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("verificationErrorTitle")}
            </h1>
            <p className="text-gray-500 max-w-md mb-8">{errorMessage}</p>

            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <Button
                variant="outline"
                onClick={() => router.push("/auth/resend-verification")}
                className="w-full"
              >
                {t("resendVerification")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
                className="text-gray-500 hover:text-gray-900"
              >
                {t("backToLogin")}
              </Button>
            </div>
          </div>
        )}

        <footer className="absolute bottom-6 flex items-center text-xs text-gray-400 gap-1">
          <Mail className="w-3 h-3" />
          <span>support@afrobraidconnect.de</span>
        </footer>
      </div>

      <div className="relative w-1/2 bg-gray-200 hidden md:block">
        <Image
          src="/images/person14.png"
          alt="Verification Background"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 0vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </div>
  );
}
