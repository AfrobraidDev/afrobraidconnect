"use client";

import React, { useState } from "react";
import { Smartphone, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF3EF]/50 to-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D0865A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D0865A]/5 blur-3xl pointer-events-none" />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D0865A]/10 border border-[#D0865A]/20 text-[#D0865A] text-sm font-semibold mb-2">
              <Smartphone className="w-4 h-4" />
              <span>Mobile App</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Take AfroBraids <br className="hidden lg:block" />
              <span className="text-[#D0865A]">Everywhere.</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              We are currently crafting the ultimate mobile experience for iOS
              and Android. Booking your favorite braiders is about to get even
              easier.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur opacity-50 transition duration-200"></div>
                <button
                  disabled
                  className="relative w-full sm:w-auto flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl opacity-90 cursor-not-allowed overflow-hidden"
                >
                  <AppleIcon />
                  <div className="text-left text-white">
                    <span className="block text-[10px] uppercase tracking-wider opacity-80 leading-none mb-1">
                      Coming Soon on the
                    </span>
                    <span className="block text-lg font-semibold leading-none">
                      App Store
                    </span>
                  </div>
                </button>
              </div>

              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur opacity-50 transition duration-200"></div>
                <button
                  disabled
                  className="relative w-full sm:w-auto flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl opacity-90 cursor-not-allowed overflow-hidden"
                >
                  <PlayStoreIcon />
                  <div className="text-left text-white">
                    <span className="block text-[10px] uppercase tracking-wider opacity-80 leading-none mb-1">
                      Coming Soon on
                    </span>
                    <span className="block text-lg font-semibold leading-none">
                      Google Play
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 max-w-md mx-auto lg:mx-0">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-center lg:justify-start gap-2">
                <Bell className="w-4 h-4 text-[#D0865A]" /> Be the first to know
                when we launch!
              </h3>

              {isSubmitted ? (
                <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    You're on the list! We'll email you soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleNotifySubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D0865A]/50 focus:border-[#D0865A] transition-all"
                  />
                  <Button
                    type="submit"
                    className="h-12 bg-[#D0865A] hover:bg-[#bf764a] text-white rounded-xl px-6 font-semibold shadow-md shadow-orange-500/10"
                  >
                    Notify Me
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="relative w-full max-w-sm mx-auto lg:max-w-none lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-full bg-white rounded-[2.5rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-50 flex flex-col">
                <div className="h-16 bg-[#D0865A] w-full flex items-end px-6 pb-4">
                  <div className="w-24 h-4 bg-white/30 rounded-full"></div>
                </div>
                <div className="p-6 space-y-4 flex-1">
                  <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-gray-100"></div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded-full"></div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-xl rotate-[-12deg] text-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#D0865A]/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 384 512"
      className="w-7 h-7 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-7 h-7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#34A853" d="M3 2.5v19l10.5-9.5L3 2.5z" />
      <path fill="#4285F4" d="M13.5 12L17.5 8.5 6 2.5l7.5 9.5z" />
      <path fill="#FBBC04" d="M13.5 12L6 21.5l11.5-6-4-3.5z" />
      <path
        fill="#EA4335"
        d="M17.5 8.5L20.5 10c1 .6 1 1.4 0 2l-3 1.5-4-3.5 4-3.5z"
      />
    </svg>
  );
}
