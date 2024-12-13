"use client";

import { useHomepageVisited } from "@/lib/contexts/homepage-visited-context";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const LogoWithBack = () => {
  const router = useRouter();
  const { hasVisitedHomepage } = useHomepageVisited();
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasVisitedHomepage && pathname !== "/") {
      router.back();
      return;
    }
    // TO FIX: there's still an edge case where you open auction/[id], login with discord, then click logo, then go <back> (with browser) and then the button goes to discord site
    router.push("/");
  };

  return (
    <Link href="/" onClick={handleLogoClick}>
      <div className="relative flex items-center gap-1">
        <Image
          src="/logo-darkmode.svg"
          alt="logo"
          width={36}
          height={36}
          className={`rotate hidden transition duration-200 dark:block ${pathname === "/" ? "" : " -rotate-90"}`}
        />
        <Image
          src="/logo-lightmode.svg"
          alt="logo"
          width={36}
          height={36}
          className={`block transition duration-200 dark:hidden ${pathname === "/" ? "" : " -rotate-90"}`}
        />
        <h1 className="hidden text-lg font-medium sm:block">
          <span className="hidden md:inline">świąteczna licytacja </span>
          <span className="hidden sm:inline">postDA</span>
        </h1>
      </div>
    </Link>
  );
};
