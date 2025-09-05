"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ServiceCard from "@/components/service-card";

type ServiceCarouselProps = {
  services: {
    image: string;
    title: string;
    rating: number;
    reviews: number;
    location: string;
    services: string[];
  }[];
};

export default function ServiceCarousel({ services }: ServiceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth; // scroll full viewport width
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const showArrows = services.length > 1;

  return (
    <div className="relative w-full mx-[20px]">
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                     bg-white shadow-md rounded-full p-2 hover:bg-gray-100 w-14 h-14 flex items-center justify-center -ml-4"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Cards Track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
      >
        {services.map((s, i) => (
          <div
            key={i}
            className="
              shrink-0 grow-0 snap-start
              basis-full md:basis-1/2 lg:basis-1/4   /* 👈 1 / 2 / 4 per view */
              px-2
            "
          >
            <ServiceCard {...s} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {showArrows && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                     bg-white shadow-md rounded-full p-2 hover:bg-gray-100 w-14 h-14 flex items-center justify-center -mr-4"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
