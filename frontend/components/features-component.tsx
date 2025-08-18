"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"
import { Business } from '@/types'

type FeaturedComponentProps = {
  businesses?: Business[];
  title?: string;
  isLoading?: boolean;
  cardClassName?: string;
  showCategory?: boolean;
  showRating?: boolean;
  cardLayout?: 'horizontal' | 'vertical';
  itemsPerView?: number;
  onCardClick?: (business: Business) => void;
};

export default function FeaturedComponent({
  businesses = [],
  title = "Featured Businesses",
  isLoading = false,
  cardClassName = "",
  showCategory = true,
  showRating = true,
  cardLayout = 'vertical',
  itemsPerView = 4,
  onCardClick,
}: FeaturedComponentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardWidth, setCardWidth] = useState(300);
  const [isMobile, setIsMobile] = useState(false);

  const displayData = businesses;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = isMobile 
        ? direction === "left" ? -cardWidth : cardWidth
        : direction === "left" ? -cardWidth * itemsPerView : cardWidth * itemsPerView;
      
      scrollRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateCardWidth();
    };

    const updateCardWidth = () => {
      if (scrollRef.current) {
        const containerWidth = scrollRef.current.clientWidth;
        const newCardWidth = isMobile 
          ? containerWidth - 32 // Account for padding
          : (containerWidth / itemsPerView) - 24; // Account for gap
        
        setCardWidth(Math.max(250, newCardWidth));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, itemsPerView]);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScroll();
    const currentRef = scrollRef.current;
    currentRef?.addEventListener("scroll", checkScroll);
    return () => currentRef?.removeEventListener("scroll", checkScroll);
  }, [displayData, cardWidth]);

  const handleCardClick = (business: Business) => {
    if (onCardClick) {
      onCardClick(business);
    }
  }

  if (isLoading) {
    return (
      <section className="py-12 px-4 sm:px-8 relative">
        <div className="container mx-auto">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="flex gap-6 px-4">
            {[...Array(itemsPerView)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-shrink-0 ${cardLayout === 'horizontal' ? 'flex min-w-[500px]' : ''}`} 
                style={{ width: `${100/itemsPerView}%` }}
              >
                <Skeleton className={`${cardLayout === 'horizontal' ? 'w-1/2' : 'w-full'} aspect-[4/3] rounded-sm`} />
                <div className={`${cardLayout === 'horizontal' ? 'w-1/2' : 'w-full'} mt-4 space-y-2 p-4`}>
                  <Skeleton className="h-6 w-3/4" />
                  {showCategory && <Skeleton className="h-4 w-1/2" />}
                  {showRating && <Skeleton className="h-4 w-1/4" />}
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!isLoading && displayData.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-8 relative">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">No businesses to display</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-8 relative">
      {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}

      {displayData.length > itemsPerView && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md transition-colors z-10 ${
              canScrollLeft ? "hover:bg-gray-50 text-purple-500 cursor-pointer" : "text-gray-300 cursor-default"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md transition-colors z-10 ${
              canScrollRight ? "hover:bg-gray-50 text-purple-500 cursor-pointer" : "text-gray-300 cursor-default"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4"
        style={{ 
          scrollSnapType: isMobile ? 'x mandatory' : 'none',
          scrollPadding: '0 16px'
        }}
      >
        {displayData.map((business) => (
          <Card 
            key={business.id} 
            className={`flex-shrink-0 overflow-hidden p-0 rounded-sm ${cardLayout === 'horizontal' ? 'flex' : ''} ${cardClassName}`}
            style={{ 
              width: `${cardWidth}px`,
              scrollSnapAlign: isMobile ? 'start' : 'none',
              marginRight: isMobile ? '16px' : '0',
              minWidth: cardLayout === 'horizontal' ? '500px' : undefined
            }}
            onClick={() => handleCardClick(business)}
          >
            <Link 
              href={`/business/${business.slug}`} 
              className={`block ${cardLayout === 'horizontal' ? 'w-1/2' : 'w-full'} aspect-[4/3] relative overflow-hidden group cursor-pointer`}
              onClick={(e) => e.stopPropagation()}
            >
              {business.image ? (
                <Image
                  src={business.image}
                  alt={business.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes={`(max-width: 768px) ${cardWidth}px, ${cardWidth}px`}
                  priority={displayData.indexOf(business) < 4} // Only prioritize first 4 images
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/30 transition-all duration-500 group-hover:opacity-90" />
            </Link>

            <div className={`p-4 space-y-2 ${cardLayout === 'horizontal' ? 'w-1/2' : ''}`}>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold line-clamp-1">{business.name}</h3>
                {showRating && business.rating && (
                  <span className="text-xs text-purple-500 bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-sm">
                    ★ {business.rating.toFixed(1)}
                  </span>
                )}
              </div>
              {showCategory && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {business.category} • {business.location}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs h-8 border-purple-200 hover:bg-purple-50 w-auto px-4 rounded-[20px] self-start"
                asChild
              >
                <Link 
                  href={`/business/${business.slug}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {business.group}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}