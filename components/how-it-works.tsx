"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";

const LOCATION_STORAGE_KEY = "afrobraids_saved_location";

type StepCardProps = {
  title: string;
  description: string;
  image: string;
};

const StepCard: React.FC<StepCardProps> = ({ title, description, image }) => {
  return (
    <Card className="flex flex-col overflow-hidden p-0 w-full md:w-[380px] h-[531px]">
      <div className="relative w-full h-[55%] bg-gray-100 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 380px"
        />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-700 text-base md:text-lg">{description}</p>
      </div>
    </Card>
  );
};

const HowItWorksSection = () => {
  const router = useRouter();
  const params = useParams();

  const handleFindBraider = () => {
    let locationName = "";
    let lat = "";
    let lng = "";

    const savedLocationStr = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (savedLocationStr) {
      try {
        const saved = JSON.parse(savedLocationStr);
        if (saved.locationName && saved.lat && saved.lng) {
          locationName = saved.locationName;
          lat = saved.lat.toString();
          lng = saved.lng.toString();
        }
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
    }

    if (!lat || !lng) {
      locationName = "Berlin, Germany";
      lat = "52.5200";
      lng = "13.4050";
    }

    const formattedDate = format(new Date(), "yyyy-MM-dd");

    const queryParams = new URLSearchParams({
      q: "",
      locationName: locationName,
      lat: lat,
      lng: lng,
      date: formattedDate,
    });

    const locale = params?.locale || "en";

    router.push(`/${locale}/search?${queryParams.toString()}`);
  };

  return (
    <section className="bg-[#170D07] py-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Link href="/how-it-works">
          <Badge className="mb-4 px-6 py-3 text-lg md:text-xl bg-white text-black font-bold rounded-full">
            How it works
          </Badge>
        </Link>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
          3 steps on how to get connected with a braider on AfroBraids
        </h2>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 mb-12">
        <StepCard
          title="Browse Braiders"
          description="Search for braiders in your city. Use our filters to find the perfect style, price range, or star rating."
          image="/images/person6.jpg"
        />
        <StepCard
          title="Book Appointment"
          description="Select a date and time, and confirm your appointment with the braider you like."
          image="/images/person12.jpg"
        />
        <StepCard
          title="Connect"
          description="Communicate directly with the braider to discuss your style, ask questions, and finalize details."
          image="/images/person19.jpg"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleFindBraider}
          className="bg-[#D0865A] text-white font-bold py-4 px-8 rounded-full text-lg hover:opacity-90 transition cursor-pointer"
        >
          Find a Braider
        </button>
      </div>
    </section>
  );
};

export default HowItWorksSection;
