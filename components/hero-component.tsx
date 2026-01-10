// app/components/HeroComponent.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function HeroComponent() {
  const [appointments, setAppointments] = useState(422698);

  // Simulate live updating number
  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const images = [
    {
      src: "/images/person1.png",
      alt: "Smiling person with braids",
      className: "rounded-2xl",
    },
    {
      src: "/images/person2.png",
      alt: "Smiling man with locs",
      className: "rounded-[120px]",
    },
    {
      src: "/images/person3.png",
      alt: "Woman with curly braids",
      className: "rounded-2xl",
    },
    {
      src: "/images/person4.png",
      alt: "Woman with curly braids",
      className: "rounded-2xl",
    },
  ];

  return (
    <section className="bg-[#fdf6f3] py-16 flex flex-col items-center w-full">
      {/* Mobile: Swiper */}
      <div className="w-full md:hidden">
        <Swiper spaceBetween={20} slidesPerView={1}>
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className={`overflow-hidden ${img.className} w-64 h-72 mx-auto relative`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: Flex row */}
      <div className="hidden md:flex gap-12 items-center justify-center w-full">
        {images.map((img, i) => (
          <div
            key={i}
            className={`overflow-hidden ${img.className} w-72 h-80 relative`}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover object-[center_20%]" />
          </div>
        ))}
      </div>

      {/* Text below */}
      <p className="mt-10 text-center px-4">
        <span className="font-instrument font-semibold text-[24px] leading-8 tracking-normal align-middle">
          {appointments.toLocaleString()}
        </span>{" "}
        <span className="font-instrument font-normal text-[24px] leading-8 tracking-[-0.015em] align-middle">
          appointments booked today
        </span>
      </p>

    </section>
  );
}
