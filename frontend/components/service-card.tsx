"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ServiceCardProps = {
  image: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
};

export default function ServiceCard({
  image,
  title,
  rating,
  reviews,
  location,
  services,
}: ServiceCardProps) {
  return (
    <Card className="h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 group p-0 flex flex-col">
      {/* Image a bit slimmer but still dominant */}
      <div className="relative w-full h-78 flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>


      <CardContent className="p-4 space-y-1 flex-grow">
        <h3 className="text-base font-semibold line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1 text-sm text-gray-700">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <Star className="w-4 h-4 fill-black text-black" />
          <span className="text-gray-500">({reviews.toLocaleString()})</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-1">{location}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {services.slice(0, 6).map((service, idx) => (
            <Badge key={idx} variant="outline" className="rounded-full border px-3 py-1 text-xs font-normal">
              {service}
            </Badge>
          ))}
          {services.length > 6 && (
            <Badge variant="outline" className="rounded-full border px-3 py-1 text-xs font-normal text-gray-500">
              +{services.length - 6}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
