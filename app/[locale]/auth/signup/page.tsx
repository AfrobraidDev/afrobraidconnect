"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { apiController } from "@/lib/apiController";
import Image from "next/image";
import { Lock, Mail, User, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/generics/Input";
import Button from "@/components/generics/Button";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";

export default function RegisterView() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [urlError]);

  const handleGoogleSignUp = () => {
    document.cookie = "auth_intent=signup; path=/; max-age=300";
    signIn("google", {
      callbackUrl: callbackUrl,
      redirect: true,
    });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError(t("errorPasswordsDoNotMatch"));
      setIsLoading(false);
      return;
    }

    try {
      await apiController({
        method: "POST",
        url: "/auth/register/",
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          confirm_password: confirmPassword,
          role: "CUSTOMER",
        },
      });

      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      console.error("Registration Error:", err);
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
            {t("verifyEmailTitle")}
          </h1>
          <p className="text-gray-600 max-w-md mb-8">
            {t.rich("verifyEmailText", {
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
            src="/images/person1.png"
            alt="Customer booking"
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
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            {t("registerTitle")}
          </h1>
          <p className="text-base text-gray-600 mb-8">
            {t("registerSubtitle")}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-600 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="sr-only">{t("firstNameLabel")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-800">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder={t("firstNamePlaceholder")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="sr-only">{t("lastNameLabel")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-800">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder={t("lastNamePlaceholder")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="sr-only">{t("emailLabel")}</label>
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

            <div>
              <label className="sr-only">{t("passwordLabel")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-800">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="sr-only">{t("confirmPasswordLabel")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-800">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? t("creatingAccount") : t("signUp")}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="px-4 text-sm text-gray-500">{t("or")}</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleSignUp}
            icon={FcGoogle}
            className="mt-0"
          >
            {t("googleSignUp")}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-8">
            {t("signInPrompt")}{" "}
            <Link
              href="/auth/login"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              {t("signInLink")}
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
          alt="Braiding service"
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
