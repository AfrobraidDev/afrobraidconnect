"use client";

import { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import ServiceCard, { ServiceCardProps } from "@/components/service-card";

type ServiceCarouselProps = {
  services: ServiceCardProps[];
  isLoading?: boolean;
};

export default function ServiceCarousel({
  services,
  isLoading = false,
}: ServiceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const showArrows = services.length > 4 && !isLoading;

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden mx-[20px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1rem)] shrink-0 h-[380px] bg-gray-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="mx-[20px] p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        No braiders found in this category right now.
      </div>
    );
  }

  return (
    <div className="relative w-full px-[20px]">
      {showArrows && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 w-12 h-12 flex items-center justify-center -ml-2 cursor-pointer border border-gray-100"
        >
          <FaArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory no-scrollbar pb-4"
      >
        {services.map((s) => (
          <div
            key={s.id}
            className="shrink-0 grow-0 snap-start w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-1rem)]"
          >
            <ServiceCard {...s} />
          </div>
        ))}
      </div>

      {showArrows && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 w-12 h-12 flex items-center justify-center -mr-2 cursor-pointer border border-gray-100"
        >
          <FaArrowRight className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
