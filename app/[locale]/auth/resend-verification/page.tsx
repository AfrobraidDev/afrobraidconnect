"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import Input from "@/components/generics/Input";
import Button from "@/components/generics/Button";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";
import { apiController } from "@/lib/apiController";
import { Link, useRouter } from "@/navigation";

export default function ResendVerificationView() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiController({
        method: "POST",
        url: "/auth/resend-verification/",
        data: { email },
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      console.error("Resend Verification Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("errorGeneric"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-white">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("resendSuccessTitle")}
          </h1>
          <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
            {t.rich("resendSuccessText", {
              email: email,
              bold: (chunks) => (
                <strong className="font-semibold text-gray-900">
                  {chunks}
                </strong>
              ),
            })}
          </p>
          <div className="space-y-3 w-full max-w-sm">
            <Button
              variant="outline"
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              {t("backToLogin")}
            </Button>
          </div>
        </div>

        <div className="relative w-1/2 bg-gray-200 hidden md:block">
          <Image
            src="/images/person16.jpg"
            alt="Customer happy"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        <main className="flex-grow flex flex-col justify-center max-w-md mx-auto py-10 w-full">
          <Link
            href="/auth/login"
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToLogin")}
          </Link>

          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            {t("resendVerificationTitle")}
          </h1>
          <p className="text-base text-gray-600 mb-8">
            {t("resendVerificationSubtitle")}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-600 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleResend} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-800">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              className="w-full"
            >
              {isLoading ? t("sendingLink") : t("sendActivationLink")}
            </Button>
          </form>
        </main>

        <footer className="mt-12 flex justify-between items-center text-xs text-gray-500 relative">
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>support@afrobraidconnect.de</span>
          </div>
          <div className="relative">
            <LanguageSelector />
          </div>
        </footer>
      </div>

      <div className="relative w-1/2 bg-gray-200 hidden md:block">
        <Image
          src="/images/person16.jpg"
          alt="Customer portrait"
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
