"use client";

import React, { useState, FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "@/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/generics/Input";
import Button from "@/components/generics/Button";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";

export default function LoginView() {
  const t = useTranslations("Auth");
  const currentLocale = useLocale();
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: `/${currentLocale}`,
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
      const session = await getSession();
      const user = session?.user;

      if (user?.role === "CUSTOMER") {
        router.push("/");
      } else if (user?.role === "BRAIDER") {
        const profile = user.braiderProfile;
        const isPhoneVerified = profile?.is_phone_verified === true;
        const isDocVerified =
          profile?.document_verification_status === "VERIFIED";
        const isPayoutsEnabled = profile?.is_payouts_enabled === true;

        if (isPhoneVerified && isDocVerified && isPayoutsEnabled) {
          router.push("/");
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }

      setIsLoading(false);
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
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  icon={Mail}
                  placeholder="hello@teni.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  icon={Lock}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end mt-2 text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#b5734c] hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

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
              href="/register"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              {t("signUpLink")}
            </Link>
          </p>

          <p className="text-center text-sm text-gray-600 mt-2">
            Haven&apos;t verified my account?{" "}
            <Link
              href="/resend-verification"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              Revalidate
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
