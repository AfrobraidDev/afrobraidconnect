"use client";

import Image from "next/image";
import Link from "next/link";

const GrowYourBusinessSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      {/* Top container */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        {/* Left text */}
        <div className="md:w-2/3">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Grow Your Business. Get Booked. Get Paid.
          </h2>
          <p className="text-gray-500 text-lg md:text-xl">
            Get noticed by new clients, manage your bookings, and build your brand—all in one place.
          </p>
        </div>

        {/* Right button */}
        <div className="md:w-auto">
          <Link href="/join-braider">
            <button className="bg-[#D0865A] text-white font-bold py-4 px-8 rounded-full text-lg hover:opacity-90 transition cursor-pointer">
              Join as a Braider
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom grid container with bigger boxes */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-8">
        {/* First box with overlay */}
        <div className="relative bg-[#FAF3EF] rounded-lg overflow-visible w-full sm:w-[350px] md:w-[600px] h-[400px] sm:h-[480px] md:h-[540px] flex items-center justify-center p-6 md:p-10">
          <Image
            src="/images/person21.png"
            alt="Business 1"
            width={600}
            height={540}
            className="object-cover rounded-lg w-full h-full object-top"
          />

          {/* Overlay div */}
          <div className="absolute right-0 md:right-[-40px] top-[58%] transform -translate-y-1/2 md:transform-none bg-[#0C111D4D] text-white p-5 rounded-2xl max-w-[320px] z-10 shadow-lg text-base leading-snug whitespace-normal">
            &quot;My sales grew 30% in 2 months with AfroBraid Connect.&quot;
            <p className="text-sm mt-4 opacity-60">twist & braids by Teni</p>
          </div>
        </div>

        {/* Second box */}
        <div className="bg-[#FAF3EF] rounded-lg overflow-hidden w-full sm:w-[350px] md:w-[600px] h-[540px] flex flex-col p-6 md:p-10">
          {/* Top image aligned to top */}
          <Image
            src="/images/person20.png"
            alt="Business 2"
            width={800}
            height={540}
            className="object-contain object-top rounded-lg w-full h-auto"
          />

          {/* Smaller bottom container */}
          <div className="bg-white rounded-2xl ml-20 w-[80%] h-[150px] mx-auto mt-25"></div>
        </div>
      </div>
    </section>
  );
};

export default GrowYourBusinessSection;
