"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type ManaraLogoProps = {
  variant?: "horizontal" | "stacked";
  className?: string;
  priority?: boolean;
};

const sources = {
  horizontal: "/images/logo-manara-horizontal.png",
  stacked: "/images/logo-manara-stacked.png",
} as const;

export function ManaraLogo({
  variant = "horizontal",
  className,
  priority = false,
}: ManaraLogoProps) {
  const src = sources[variant];
  const isHorizontal = variant === "horizontal";

  return (
    <Image
      src={src}
      alt="Manara Network"
      width={isHorizontal ? 200 : 120}
      height={isHorizontal ? 48 : 100}
      className={cn(
        isHorizontal
          ? "h-9 w-auto sm:h-10"
          : "h-16 w-auto sm:h-[4.5rem]",
        className
      )}
      priority={priority}
    />
  );
}
