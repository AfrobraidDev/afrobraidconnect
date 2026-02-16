"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiController } from "@/lib/apiController";

export default function RateReview() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating before submitting.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiController({
        method: "POST",
        url: `/reviews/public/submit/${bookingId}/`,
        data: {
          rating,
          comment: comment.trim() || undefined,
        },
        requiresAuth: false,
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Thank you for your feedback!
          </h2>
          <p className="text-gray-500 mb-8">
            Your review helps our braiders grow and helps other clients make
            great choices.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full h-12 bg-[#D0865A] hover:bg-[#bf764a] text-white rounded-xl text-base font-semibold transition-all"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 selection:bg-[#D0865A]/20">
      <div className="w-full max-w-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#170D07] p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Rate your experience
            </h1>
            <p className="text-white/80 text-sm">
              How was your appointment? Let us know!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D0865A] rounded-full transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ${
                        star <= (hoverRating || rating)
                          ? "fill-[#D0865A] text-[#D0865A]"
                          : "fill-transparent text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider h-5">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent!"}
              </span>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="comment"
                className="flex items-baseline justify-between text-sm font-semibold text-gray-900"
              >
                Leave a comment
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  Optional but recommended
                </span>
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you loved, or what could be improved..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#D0865A] focus:ring-2 focus:ring-[#D0865A]/20 transition-all outline-none resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || rating === 0}
              className="w-full h-14 bg-[#D0865A] hover:bg-[#bf764a] text-white rounded-xl text-lg font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
