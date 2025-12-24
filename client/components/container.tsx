import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "5xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "5xl": "max-w-5xl",
  full: "max-w-full",
};

export default function Container({
  children,
  className,
  maxWidth = "xl",
}: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}
