import { AddAuctionButton } from "@/components/add-auction-button";
import { LogoWithBack } from "@/components/logo-with-back";
import { SignInButton } from "@/components/sign-in-button";
import { DarkModeToggle } from "../components/dark-mode-toggle";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <LogoWithBack />
        <div className="flex gap-2">
          <DarkModeToggle />
          <AddAuctionButton />
          <SignInButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
