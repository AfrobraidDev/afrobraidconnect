"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecentlyViewed } from "@/app/context/RecentlyViewedContext";
import { useRouter } from "@/navigation";

export type ServiceCardProps = {
  id: string;
  image: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
};

export default function ServiceCard({
  id,
  image,
  title,
  rating,
  reviews,
  location,
  services,
}: ServiceCardProps) {
  const { addToRecentlyViewed } = useRecentlyViewed();
  const router = useRouter();

  const handleClick = () => {
    addToRecentlyViewed({
      id,
      image,
      title,
      rating,
      reviews,
      location,
      services,
    });
    router.push(`/braider/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 group p-0 flex flex-col cursor-pointer bg-white h-full"
    >
      <div className="relative w-full h-[220px] shrink-0 bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-semibold line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <Star className="w-4 h-4 fill-black text-black" />
          <span className="text-gray-500">({reviews.toLocaleString()})</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-1 mt-1">{location}</p>

        <div className="flex flex-wrap gap-2 pt-3 mt-auto">
          {services.slice(0, 3).map((service, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="rounded-full border px-2 py-0.5 text-[10px] font-normal truncate max-w-[120px]"
            >
              {service}
            </Badge>
          ))}
          {services.length > 3 && (
            <Badge
              variant="outline"
              className="rounded-full border px-2 py-0.5 text-[10px] font-normal text-gray-500"
            >
              +{services.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
