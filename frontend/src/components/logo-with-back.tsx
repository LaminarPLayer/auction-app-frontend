"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoBackIcon } from "./logo-back-icon";

export const LogoWithBack = () => {
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/", { scroll: false });
    }
  };

  return (
    <Link href="/" onClick={handleLogoClick}>
      <div className="relative flex items-center gap-1">
        <LogoBackIcon className="absolute -left-3 -mr-1 size-4" />
        <Image
          src="/logo-darkmode.svg"
          alt="logo"
          width={36}
          height={36}
          className="hidden dark:block"
        />
        <Image
          src="/logo-lightmode.svg"
          alt="logo"
          width={36}
          height={36}
          className="block dark:hidden"
        />
        <h1 className="hidden text-lg font-medium sm:block">
          <span className="hidden md:inline">świąteczna licytacja </span>
          <span className="hidden sm:inline">postDA</span>
        </h1>
      </div>
    </Link>
  );
};
