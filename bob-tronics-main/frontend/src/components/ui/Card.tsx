import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  md: "p-5",
  lg: "p-5 sm:p-7",
};

export default function Card({ children, padding = "lg", className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line/70 bg-white shadow-card ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
