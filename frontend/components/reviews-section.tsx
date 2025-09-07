"use client";

import Image from "next/image";
import { IoStar } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { Swiper as SwiperType } from "swiper";

type ReviewCardProps = {
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  name: string;
  bgColor: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  role,
  rating,
  comment,
  avatar,
  name,
  bgColor,
}) => {
  const isLight = bgColor.includes("#FAF3EF");

  const badgeBg = isLight ? "bg-[#D0865A]" : "bg-[#FAF3EF]";
  const badgeText = isLight ? "text-white" : "text-[#e27b40]";
  const starColor = isLight ? "text-[#D0865A]" : "text-[#FAF3EF]";

  return (
    <div className={`rounded-xl p-6 flex flex-col justify-between h-full ${bgColor}`}>
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4 w-max ${badgeBg} ${badgeText}`}
      >
        {role}
      </span>

      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <IoStar
            key={idx}
            className={`h-5 w-5 ${idx < rating ? starColor : "text-white/40"}`}
          />
        ))}
      </div>

      <p className={`mb-6 text-sm md:text-base leading-relaxed ${isLight ? "text-black" : "text-white"}`}>
        {comment}
      </p>

      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 relative rounded-full overflow-hidden">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <span className={`${isLight ? "text-black" : "text-white"} font-semibold`}>{name}</span>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const reviews: ReviewCardProps[] = [
    {
      role: "Customer",
      rating: 5,
      comment:
        "AfroBraid has helped me grow my client base. I used to rely only on Instagram DMs, now I get more bookings with less stress.",
      avatar: "/images/avatar1.jpg",
      name: "Teni O.",
      bgColor: "bg-[#FAF3EF]",
    },
    {
      role: "Braider",
      rating: 4,
      comment:
        "Finding a good braider used to be so stressful. With AfroBraid, I booked Amina in Neukölln and I’m in love with my new twists! Smooth process from start to finish.",
      avatar: "/images/avatar2.png",
      name: "Amina K.",
      bgColor: "bg-[#D0865A]",
    },
    {
      role: "Customer",
      rating: 5,
      comment: "Quick, easy, and professional! My braids have never looked better.",
      avatar: "/images/avatar1.jpg",
      name: "Chika I.",
      bgColor: "bg-[#FAF3EF]",
    },
    {
      role: "Customer",
      rating: 4,
      comment: "Superb platform. I got more clients this month than ever before!",
      avatar: "/images/avatar3.png",
      name: "Yemi A.",
      bgColor: "bg-[#D0865A]",
    },
    {
      role: "Braider",
      rating: 5,
      comment: "AfroBraid makes booking so simple and fast for my clients!",
      avatar: "/images/avatar2.png",
      name: "Ngozi K.",
      bgColor: "bg-[#FAF3EF]",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mb-12 text-left px-4 sm:px-6 lg:ml-80">
        <span className="inline-block bg-[#FAF3EF] text-[#e25c0e] font-bold px-6 py-2 rounded-full mb-4 border-[1px] border-[#e27b40]">
          Reviews
        </span>
        <h2 className="w-full text-3xl md:text-4xl font-bold mb-2 text-nowrap">
          Rated ★★★★★ by Customers
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          Loved by thousands of braiders.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-[#D0865A] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition flex items-center justify-center cursor-pointer"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-[#D0865A] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition flex items-center justify-center cursor-pointer"
        >
          <FaArrowRight className="w-4 h-4" />
        </button>

        <Swiper
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx}>
              <ReviewCard {...review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ReviewsSection;
