"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/navigation";
import Image from "next/image";
import { Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/generics/Input";
import Button from "@/components/generics/Button";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";

export default function LoginView() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [urlError]);

  const handleGoogleSignIn = () => {
    document.cookie = "auth_intent=login; path=/; max-age=300";
    signIn("google", {
      callbackUrl: callbackUrl,
      redirect: true,
    });
  };

  const handleCredentialsSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setIsLoading(false);
      setError("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      router.refresh();
      router.push(callbackUrl);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        <main className="flex-grow flex flex-col justify-center max-w-md mx-auto py-10 w-full">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            {t("loginTitle")}
          </h1>
          <p className="text-base text-gray-600 mb-8">{t("loginSubtitle")}</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  icon={Mail}
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  icon={Lock}
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end mt-2 text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-[#b5734c] hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} variant="primary">
              {isLoading ? t("signingIn") : t("signIn")}
            </Button>
          </form>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="px-4 text-sm text-gray-500">{t("or")}</span>
            <hr className="flex-grow border-gray-200" />
          </div>
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            icon={FcGoogle}
            className="mt-6"
          >
            {t("googleSignIn")}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-8">
            {t("signUpPrompt")}{" "}
            <Link
              href="/auth/register"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              {t("signUpLink")}
            </Link>
          </p>

          <p className="text-center text-sm text-gray-600 mt-2">
            {t("revalidatePrompt")}{" "}
            <Link
              href="/auth/resend-verification"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              {t("revalidateLink")}
            </Link>
          </p>
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
          src="/images/person1.png"
          alt="Customer booking appointment"
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
