"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { apiController } from "@/lib/apiController";
import { BraiderProfileData, Service, Location } from "./types/braider";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BookingModal from "@/components/booking/booking-modal";

const BraiderMap = dynamic(
  () => import("@/components/braiders-components/braider-map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-50 animate-pulse flex items-center justify-center text-gray-400 text-sm rounded-xl border border-gray-100">
        Loading Map...
      </div>
    ),
  }
);

function BraiderLogo({ url, alt }: { url: string; alt: string }) {
  const [src, setSrc] = useState(url);

  return (
    <div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0 bg-gray-50">
      <Image
        src={src || "/images/afro-connect.png"}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 80px, 128px"
        priority
        unoptimized
        onError={() => setSrc("/images/afro-connect.png")}
      />
    </div>
  );
}

export default function BraiderProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const [profile, setProfile] = useState<BraiderProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiController<{ data: BraiderProfileData }>({
          method: "GET",
          url: `/customers/braiders/${params.id}/`,
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProfile();
  }, [params.id]);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const scrollToServices = () => {
    const element = document.getElementById("services-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!profile)
    return <div className="p-20 text-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header / Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <BraiderLogo
              url={profile.business_logo_url}
              alt={profile.business_name}
            />

            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profile.business_name}
                </h1>
                {profile.document_verification_status === "VERIFIED" && (
                  <Badge
                    variant="secondary"
                    className="w-fit bg-green-50 text-green-700 border-green-100 gap-1 px-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 text-[#D0865A] fill-[#D0865A]" />
                  <span className="font-bold text-gray-900">
                    {profile.average_rating}
                  </span>
                  <span className="text-gray-400">
                    ({profile.review_count})
                  </span>
                </div>
                <span className="hidden sm:inline text-gray-300">•</span>
                <span className="text-gray-500 font-medium">
                  @{profile.display_name}
                </span>
              </div>

              <p className="text-gray-600 max-w-2xl leading-relaxed text-sm sm:text-base">
                {profile.bio}
              </p>
            </div>

            <div className="hidden md:block shrink-0">
              <Button
                onClick={scrollToServices}
                className="bg-[#D0865A] hover:bg-[#bf764a] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/10 cursor-pointer"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            {/* Portfolio */}
            {profile.portfolio.length > 0 && (
              <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Portfolio
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {profile.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-gray-100"
                    >
                      <Image
                        src={item.image_url}
                        alt="Portfolio"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            <section
              id="services-section"
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Services Menu
              </h2>
              <div className="space-y-4">
                {profile.services.map((service) => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    onBook={() => handleBookService(service)}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="h-64 sm:h-72 w-full relative rounded-t-xl overflow-hidden">
                <BraiderMap
                  locations={profile.locations}
                  selectedLocation={activeLocation}
                />
              </div>

              <div className="p-4 sm:p-5 bg-white">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D0865A]" /> Service
                  Locations
                </h3>

                <div className="space-y-2">
                  {profile.locations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setActiveLocation(loc)}
                      className={`w-full text-left flex items-start gap-3 text-sm p-3 rounded-xl transition-all border
                             ${
                               activeLocation?.id === loc.id
                                 ? "bg-[#D0865A]/5 border-[#D0865A] shadow-sm ring-1 ring-[#D0865A]/20"
                                 : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                             }`}
                    >
                      <div className="mt-0.5 text-lg shrink-0">
                        {loc.service_type === "SHOP_BASED" && "🏪"}
                        {loc.service_type === "MOBILE_BASED" && "🚗"}
                        {loc.service_type === "HOME_BASED" && "🏠"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p
                            className={`font-medium truncate ${
                              activeLocation?.id === loc.id
                                ? "text-[#D0865A]"
                                : "text-gray-900"
                            }`}
                          >
                            {loc.service_type
                              .replace("_BASED", "")
                              .replace("_", " ")}
                          </p>
                          {activeLocation?.id === loc.id && (
                            <ArrowRight className="w-3 h-3 text-[#D0865A]" />
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                          {loc.service_type === "SHOP_BASED"
                            ? loc.address
                            : `Serves ${loc.city} (${loc.radius_km}km radius)`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#FAF3EF] rounded-2xl p-6 border border-[#D0865A]/10">
              <h3 className="font-bold text-gray-900 mb-3">Availability</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-medium text-gray-900">
                  Accepting new clients
                </p>
              </div>
              <Separator className="bg-[#D0865A]/10 mb-4" />
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg w-fit">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Phone Verified</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button
          onClick={scrollToServices}
          className="w-full bg-[#D0865A] hover:bg-[#bf764a] text-white h-12 rounded-xl text-lg font-semibold cursor-pointer"
        >
          Book Appointment
        </Button>
      </div>

      {selectedService && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          braiderId={profile.id}
          service={selectedService}
          initialDate={dateParam}
        />
      )}
    </div>
  );
}

function ServiceItem({
  service,
  onBook,
}: {
  service: Service;
  onBook: () => void;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:border-[#D0865A]/30 transition-all bg-white hover:shadow-sm group">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base">
            {service.skill_name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1.5">
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded text-xs">
              <Clock className="w-3 h-3" />{" "}
              {Math.floor(service.base_duration_minutes / 60)}h{" "}
              {service.base_duration_minutes % 60 > 0 &&
                `${service.base_duration_minutes % 60}m`}
            </span>
            <span className="font-semibold text-gray-900 text-sm">
              €{service.base_price}
            </span>
          </div>
        </div>

        <Button
          onClick={onBook}
          className="shrink-0 bg-black text-white hover:bg-[#D0865A] rounded-lg px-6 h-10 transition-colors shadow-sm w-full sm:w-auto cursor-pointer"
        >
          Book
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {service.description}
      </p>

      {service.variations.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="variations" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-medium text-[#D0865A] hover:no-underline hover:bg-[#D0865A]/5 rounded px-2 w-full justify-between cursor-pointer">
              <span>
                Customize Service ({service.variations.length} options)
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-0">
              <div className="grid gap-2">
                {service.variations.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex justify-between items-center text-sm p-2.5 bg-gray-50/80 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        {variant.name}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider border border-gray-200 px-1 py-0.5 rounded bg-white">
                        {variant.category}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      {variant.duration_adjustment > 0 && (
                        <span className="text-[10px] text-gray-400">
                          +{variant.duration_adjustment}m
                        </span>
                      )}
                      <div className="font-semibold text-gray-900 text-xs bg-white px-1.5 py-0.5 rounded border border-gray-100">
                        +€{variant.price_adjustment}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
