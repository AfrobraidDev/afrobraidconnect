"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  MessageCircle,
} from "lucide-react";
import { useBookings, useBookingDetails } from "./use-bookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ChatView from "./ChatView";

const formatPrice = (amount: string | number) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(amount));
};

const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return "bg-green-100 text-green-700 border-green-200";
    case "COMPLETED":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    case "PENDING":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-blue-100 text-blue-700 border-blue-200";
  }
};

export default function MyBookings() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { status } = useSession();

  const [chatSession, setChatSession] = useState<{
    bookingId: string;
    braiderName: string;
  } | null>(null);

  const { data, isLoading, isError, isFetching } = useBookings(page, pageSize);

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const { data: bookingDetails, isLoading: isDetailsLoading } =
    useBookingDetails(selectedBookingId);

  const bookings = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-10 h-10 animate-spin text-[#D0865A]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign in Required
        </h2>
        <p className="text-gray-500 mb-6">
          Please log in to view your bookings.
        </p>
        <Button
          onClick={() => (window.location.href = "/auth/login")}
          className="bg-[#D0865A] hover:bg-[#bf764a]"
        >
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Bookings
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and view your appointment history.
            </p>
          </div>
          {isFetching && !isLoading && (
            <div className="flex items-center text-sm text-[#D0865A] bg-[#D0865A]/10 px-3 py-1.5 rounded-full font-medium">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#D0865A] mb-4" />
            <p className="text-gray-500">Loading your appointments...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            <p>Failed to load bookings. Please try refreshing the page.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-500 mb-6">
              When you book an appointment, it will appear here.
            </p>
            <Button className="bg-[#D0865A] hover:bg-[#bf764a] text-white rounded-xl">
              Explore Braiders
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#D0865A]/30 transition-all shadow-sm flex flex-col sm:flex-row gap-5 sm:items-center justify-between group cursor-pointer"
                onClick={() => setSelectedBookingId(booking.id)}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge
                      className={`${getStatusStyles(booking.status)} shadow-none`}
                    >
                      {booking.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-gray-600 bg-gray-50 border-gray-200 shadow-none font-normal flex items-center gap-1"
                    >
                      <Activity className="w-3 h-3" />
                      {booking.timeline_status}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-gray-400" />{" "}
                    {booking.service_name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D0865A]" />
                      <span>
                        {format(parseISO(booking.start_time), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D0865A]" />
                      <span>
                        {format(parseISO(booking.start_time), "h:mm a")} -{" "}
                        {format(parseISO(booking.end_time), "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 min-w-[150px]">
                  <div className="text-sm text-gray-500 sm:text-right w-full">
                    {booking.is_fully_paid ? (
                      <div className="flex items-center sm:justify-end gap-1 text-green-600 font-medium mb-1">
                        <CheckCircle2 className="w-4 h-4" /> Fully Paid
                      </div>
                    ) : (
                      <div className="flex items-center sm:justify-end gap-1 text-orange-600 font-medium mb-1">
                        <AlertCircle className="w-4 h-4" /> Due:{" "}
                        {formatPrice(booking.balance_due)}
                      </div>
                    )}
                    <span className="block text-xs uppercase tracking-wider mb-0.5 mt-2">
                      Braider
                    </span>
                    <span className="font-semibold text-gray-900 block truncate">
                      {booking.braider_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 rounded-full bg-orange-50 text-[#D0865A] hover:bg-orange-100 px-3 shadow-none border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatSession({
                          bookingId: booking.id,
                          braiderName: booking.braider_name,
                        });
                      }}
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Message
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full group-hover:bg-[#D0865A]/10 group-hover:text-[#D0865A] transition-colors hidden sm:flex"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="text-sm text-gray-500 font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="rounded-xl"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedBookingId}
        onOpenChange={(open) => !open && setSelectedBookingId(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden bg-white">
          <DialogTitle className="sr-only">Appointment Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed breakdown of your booking.
          </DialogDescription>

          <div className="bg-gray-50 border-b border-gray-100 p-5 relative">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Appointment Details
            </h2>
            <p className="text-sm text-gray-500">
              Ref: {selectedBookingId?.split("-")[0].toUpperCase()}
            </p>
          </div>

          <div className="p-6">
            {isDetailsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#D0865A]" />
              </div>
            ) : bookingDetails ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">
                      {bookingDetails.service_name}
                    </h3>
                    <p className="text-gray-500">
                      with {bookingDetails.braider_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {bookingDetails.braider_business}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={`${getStatusStyles(bookingDetails.status)} shadow-none`}
                    >
                      {bookingDetails.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-gray-500 bg-gray-50 font-normal"
                    >
                      {bookingDetails.timeline_status}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {format(
                        parseISO(bookingDetails.start_time),
                        "EEEE, MMMM do, yyyy",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {format(parseISO(bookingDetails.start_time), "h:mm a")} -{" "}
                      {format(parseISO(bookingDetails.end_time), "h:mm a")}
                    </span>
                  </div>
                </div>

                {bookingDetails.variations &&
                  bookingDetails.variations.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Add-ons & Variations
                      </h4>
                      {bookingDetails.variations.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-500">{variant.name}</span>
                          <span className="text-gray-700">
                            +{formatPrice(variant.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Payment Summary
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Price</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(bookingDetails.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid (Deposit)</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(bookingDetails.amount_paid)}
                    </span>
                  </div>

                  {bookingDetails.balance_due > 0 ? (
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-50 mt-1">
                      <span className="text-gray-900">Balance Due</span>
                      <span className="text-[#D0865A]">
                        {formatPrice(bookingDetails.balance_due)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-50 mt-1">
                      <span className="text-gray-900">Status</span>
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Fully Paid
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Button
                    className="w-full rounded-xl h-12 bg-[#D0865A] hover:bg-[#bf764a] text-white shadow-md text-base"
                    onClick={() => {
                      setChatSession({
                        bookingId: bookingDetails.id,
                        braiderName: bookingDetails.braider_name,
                      });
                      setSelectedBookingId(null);
                    }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> Message Braider
                  </Button>

                  {bookingDetails.status === "PENDING" && (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">
                Could not load booking details.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {chatSession && (
        <ChatView
          bookingId={chatSession.bookingId}
          braiderName={chatSession.braiderName}
          onClose={() => setChatSession(null)}
        />
      )}
    </div>
  );
}
