"use client";

import { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
} from "date-fns";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
  onCancel?: () => void;
  isMobileOpen?: boolean; // mobile modal control
  setIsMobileOpen?: (open: boolean) => void;
}

const CustomDatePicker = ({
  selectedDate: initialSelectedDate,
  onSelect,
  onCancel,
  isMobileOpen = false,
  setIsMobileOpen,
}: CustomDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialSelectedDate || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (initialSelectedDate) setSelectedDate(initialSelectedDate);
  }, [initialSelectedDate]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const today = new Date();

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleBadgeClick = (type: "any" | "today" | "tomorrow") => {
    if (type === "any") setSelectedDate(null);
    if (type === "today") setSelectedDate(today);
    if (type === "tomorrow") setSelectedDate(addDays(today, 1));
  };

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;
    setSelectedDate(day);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextMonth,
    onSwipedRight: handlePrevMonth,
    trackMouse: true,
  });

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={handlePrevMonth}
        className="p-2 rounded-full bg-[#FAF3EF] text-[#D0865A] hover:opacity-90"
      >
        <ChevronLeft />
      </button>
      <div className="font-semibold text-lg">{format(currentMonth, "MMMM yyyy")}</div>
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full bg-[#FAF3EF] text-[#D0865A] hover:opacity-90"
      >
        <ChevronRight />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = isBefore(cloneDay, today);
        const isSelected = selectedDate && isSameDay(cloneDay, selectedDate);
        const isCurrentMonth = isSameMonth(cloneDay, currentMonth);

        days.push(
          <div
            key={cloneDay.toString()}
            className={`p-2 h-12 flex items-center justify-center cursor-pointer rounded-full transition
              ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""}
              ${isSelected ? "bg-[#D0865A] text-white" : ""}
              ${!isSelected && !isDisabled && isCurrentMonth ? "hover:bg-[#D0865A]/20" : ""}`}
            onClick={() => !isDisabled && handleDateClick(cloneDay)}
          >
            {format(cloneDay, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 mb-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const CalendarContent = () => (
    <div {...swipeHandlers}>
      {/* Badges */}
      <div className="flex gap-4 mb-4 justify-center">
        <button
          onClick={() => handleBadgeClick("any")}
          className={`px-4 py-2 rounded-full font-semibold border ${
            !selectedDate ? "bg-[#D0865A] text-white border-[#D0865A]" : "bg-[#FAF3EF] text-[#D0865A] border-[#D0865A]"
          }`}
        >
          Any Date
        </button>
        <button
          onClick={() => handleBadgeClick("today")}
          className={`px-4 py-2 rounded-full font-semibold border ${
            selectedDate && isSameDay(selectedDate, today)
              ? "bg-[#D0865A] text-white border-[#D0865A]"
              : "bg-[#FAF3EF] text-[#D0865A] border-[#D0865A]"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => handleBadgeClick("tomorrow")}
          className={`px-4 py-2 rounded-full font-semibold border ${
            selectedDate && isSameDay(selectedDate, addDays(today, 1))
              ? "bg-[#D0865A] text-white border-[#D0865A]"
              : "bg-[#FAF3EF] text-[#D0865A] border-[#D0865A]"
          }`}
        >
          Tomorrow
        </button>
      </div>

      {/* Calendar */}
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {/* Action buttons */}
      <div className="flex justify-between mt-4 gap-4">
        <button
          onClick={() => {
            onCancel?.();
            if (setIsMobileOpen) setIsMobileOpen(false);
          }}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-semibold hover:opacity-90 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (selectedDate) onSelect?.(selectedDate);
            if (setIsMobileOpen) setIsMobileOpen(false);
          }}
          className="flex-1 px-4 py-2 bg-[#D0865A] text-white rounded-full font-semibold hover:opacity-90 transition"
        >
          Choose Date
        </button>
      </div>
    </div>
  );

  // Detect mobile via window width
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      {/* Desktop / normal container */}
      {!isMobile && (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg" {...swipeHandlers}>
          <CalendarContent />
        </div>
      )}

      {/* Mobile full-screen modal */}
      {isMobile && isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-20">
          <div className="w-full h-full max-w-md bg-white rounded-xl p-6 overflow-auto relative shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setIsMobileOpen?.(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              ✕
            </button>

            {/* Calendar content */}
            <div className="mt-6">
              <CalendarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomDatePicker;
