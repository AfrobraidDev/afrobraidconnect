"use client";

import HeroSection from "@/components/Hero-Section";
import AppLayout from "@/components/app-layout";
import ServiceCarousel from "@/components/service-carousel";
import ServiceCard from "@/components/service-card";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import HowItWorksSection from "@/components/how-it-works";
import GrowYourBusinessSection from "@/components/grow-business";
import HeroDownSection from "@/components/hero-down-section";
import ReviewsSection from "@/components/reviews-section";
import FAQsSection from "@/components/faq-section";
import { useHomeBraiders } from "@/components/home/hooks/useHomeBraiders";

export default function Home() {
  const { recentlyViewed } = useRecentlyViewed();

  const { newToAfroBraid, trending, recommended, isLoading } =
    useHomeBraiders();

  return (
    <AppLayout>
      <main className="flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden">
        <HeroSection />

        {recentlyViewed && recentlyViewed.length > 0 && (
          <section className="mt-12 mb-20 ml-5 mr-5 lg:ml-20 lg:mr-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 mx-[20px] text-gray-900">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-[20px]">
              {recentlyViewed.map((service, idx) => (
                <ServiceCard key={idx} {...service} />
              ))}
            </div>
          </section>
        )}

        {(isLoading || recommended.length > 0) && (
          <section className="mt-12 mb-20 ml-5 mr-5 lg:ml-20 lg:mr-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 mx-[20px] text-gray-900">
              Recommended For You
            </h2>
            <ServiceCarousel services={recommended} isLoading={isLoading} />
          </section>
        )}

        {(isLoading || trending.length > 0) && (
          <section className="mt-12 mb-20 ml-5 mr-5 lg:ml-20 lg:mr-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 mx-[20px] text-gray-900">
              Trending Near You
            </h2>
            <ServiceCarousel services={trending} isLoading={isLoading} />
          </section>
        )}

        {(isLoading || newToAfroBraid.length > 0) && (
          <section className="mt-12 mb-20 ml-5 mr-5 lg:ml-20 lg:mr-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 mx-[20px] text-gray-900">
              New to AfroBraid
            </h2>
            <ServiceCarousel services={newToAfroBraid} isLoading={isLoading} />
          </section>
        )}

        <HowItWorksSection />
        <GrowYourBusinessSection />
        <ReviewsSection />
        <FAQsSection />
        <HeroDownSection />
      </main>
    </AppLayout>
  );
}
