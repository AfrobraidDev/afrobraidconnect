"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Star, MessageSquare } from "lucide-react";
import { apiController } from "@/lib/apiController";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface BraiderReviewsProps {
  braiderId: string;
}

export default function BraiderReviews({ braiderId }: BraiderReviewsProps) {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["braider-reviews", braiderId],
    queryFn: async () => {
      const res = await apiController<{ data: Review[] }>({
        method: "GET",
        url: `/reviews/list/?braider_id=${braiderId}`,
      });
      return res.data || [];
    },
    enabled: !!braiderId,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#D0865A]" />
        Client Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">
            No reviews yet for this braider.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-gray-900 block">
                    {review.customer_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(parseISO(review.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-[#D0865A] fill-[#D0865A]" />
                  <span className="text-sm font-bold text-gray-900 leading-none">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                &quot;{review.comment}&quot;
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
