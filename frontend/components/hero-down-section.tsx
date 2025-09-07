// components/HeroSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const HeroDownSection = () => {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px]">
      {/* Background Image with dim effect */}
      <Image
        src="/images/person22.png"
        alt="Hero Background"
        fill
        className="object-cover w-full h-full object-center brightness-75"
        priority
      />

      {/* Overlay for text/buttons */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-0">
        {/* Hero Text */}
        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-semibold mb-8 max-w-3xl">
          Your next great look or business opportunity is waiting.
        </h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/browse-braiders">
            <button className="bg-[#D0865A] text-white font-bold py-4 px-8 rounded-full text-lg hover:opacity-90 transition cursor-pointer">
              Find a Braider
            </button>
          </Link>
          <Link href="/join-braider">
            <button className="bg-white text-[#e27b40] font-bold py-4 px-8 rounded-full text-lg hover:opacity-90 transition cursor-pointer">
              Join as a Braider
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroDownSection;
