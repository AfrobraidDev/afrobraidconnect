import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  isLoading?: boolean;
  icon?: React.ElementType; // Allows passing Lucide icons or other components
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  type = "button",
  icon: Icon,
  ...props
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center w-full px-4 py-3 font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "text-white bg-[#b5734c] hover:bg-[#b47550] focus:ring-[#b47550] disabled:bg-[#b5734c]",
    outline:
      "border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-200",
    ghost:
      "text-[#b5734c] hover:underline bg-transparent hover:bg-transparent px-0 py-0 w-auto",
  };

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {!isLoading && Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
}
