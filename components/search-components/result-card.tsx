"use client";

import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BraiderResult } from "./types/search";
import { Link } from "@/navigation";
import { useState } from "react";

export default function ResultCard({
  data,
  dateParam,
}: {
  data: BraiderResult;
  dateParam?: string | null;
}) {
  const [isHoveringSkills, setIsHoveringSkills] = useState(false);

  const mainImage =
    data.portfolio.length > 0
      ? data.portfolio[0].image_url
      : data.business_logo_url || "/images/placeholder-hair.jpg";

  const primaryLocation =
    data.locations.find((l) => l.service_type === "SHOP_BASED") ||
    data.locations[0];

  const locationText = primaryLocation
    ? primaryLocation.address ||
      `${primaryLocation.city}, ${primaryLocation.country}`
    : "Location varies";

  const ratingValue = parseFloat(data.average_rating || "0");

  const BATCH_SIZE = 3;
  const totalSkills = data.skills;
  const remainingCount = Math.max(0, totalSkills.length - BATCH_SIZE);

  const start = isHoveringSkills && remainingCount > 0 ? BATCH_SIZE : 0;
  const end =
    isHoveringSkills && remainingCount > 0 ? BATCH_SIZE * 2 : BATCH_SIZE;
  const visibleSkills = totalSkills.slice(start, end);

  const profileUrl = dateParam
    ? `/braider/${data.id}?date=${dateParam}`
    : `/braider/${data.id}`;

  return (
    <Link href={profileUrl} className="block h-full">
      <Card className="h-[380px] sm:h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 group p-0 flex flex-col cursor-pointer bg-white">
        <div className="relative w-full h-[45%] shrink-0 bg-gray-100">
          <Image
            src={mainImage}
            alt={data.business_name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />

          <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
            {data.locations.map((loc) => (
              <Badge
                key={loc.id}
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-0.5 shadow-sm hover:bg-white border border-gray-100"
              >
                {loc.service_type.replace("_BASED", "").replace("_", " ")}
              </Badge>
            ))}
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 flex flex-col h-[55%]">
          <div className="space-y-1">
            <h3
              className="text-base font-semibold line-clamp-1 text-gray-900"
              title={data.business_name}
            >
              {data.business_name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <span className="font-semibold">{ratingValue.toFixed(1)}</span>
              <Star className="w-3.5 h-3.5 fill-black text-black" />
              <span className="text-gray-500">
                ({data.review_count.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
              <p className="line-clamp-1 break-all">{locationText}</p>
            </div>
          </div>
          <div className="mt-auto space-y-3">
            <div
              className="h-6 flex items-center gap-1.5 overflow-hidden"
              onMouseEnter={() => setIsHoveringSkills(true)}
              onMouseLeave={() => setIsHoveringSkills(false)}
            >
              {visibleSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className="rounded-full border px-2 py-[2px] text-[10px] font-normal whitespace-nowrap bg-white hover:bg-gray-50 transition-colors shrink-0"
                >
                  {skill.name}
                </Badge>
              ))}

              {remainingCount > 0 && !isHoveringSkills && (
                <Badge
                  variant="outline"
                  className="rounded-full border px-2 py-[2px] text-[10px] font-normal text-gray-500 bg-gray-50 cursor-default shrink-0"
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-end">
              <span className="text-[#D0865A] text-xs font-semibold bg-[#D0865A]/10 px-2 py-1 rounded-md whitespace-nowrap">
                {data.distance_from_user_km.toFixed(1)} km away
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
