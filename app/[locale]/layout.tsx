import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "../../app/globals.css";
import { RecentlyViewedProvider } from "../context/RecentlyViewedContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import QueryProvider from "@/providers/QueryProvider";
import { notFound } from "next/navigation";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "AfroBraids Connect",
  description: "Find braiders near you",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!["en", "de", "fr"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${instrumentSans.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <RecentlyViewedProvider>
              <main className="flex-1">{children}</main>
              <Toaster position="bottom-right" richColors />
            </RecentlyViewedProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
