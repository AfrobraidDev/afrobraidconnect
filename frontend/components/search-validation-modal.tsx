"use client";

import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface SearchValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function SearchValidationModal({
  isOpen,
  onClose,
  message,
}: SearchValidationModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen
          ? "bg-black/50 backdrop-blur-sm opacity-100"
          : "bg-black/0 opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-[#D0865A]" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Missing Details
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          <Button
            onClick={onClose}
            className="w-full bg-[#D0865A] hover:bg-[#bf764a] text-white rounded-xl py-6 text-base font-medium shadow-md hover:shadow-lg transition-all"
          >
            Okay, got it
          </Button>
        </div>
      </div>
    </div>
  );
}
