"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export function LogoBackIcon({ className }: { className?: string }) {
  const pathname = usePathname();
  return pathname === "/" ? null : <ChevronLeft className={className} />;
}
