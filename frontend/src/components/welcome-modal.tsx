"use client";

import { User } from "@/lib/types/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const WelcomeModal = ({ user }: { user: User }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [dontShowWelcomeModal, setDontShowWelcomeModal] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      localStorage.setItem("dont_show_welcome_modal", "true");
      setDontShowWelcomeModal(true);
    } else {
      localStorage.removeItem("dont_show_welcome_modal");
      setDontShowWelcomeModal(false);
    }
  };

  useEffect(() => {
    const dontShowWelcomeModal = localStorage.getItem(
      "dont_show_welcome_modal",
    );
    setDontShowWelcomeModal(dontShowWelcomeModal === "true");
  }, []);

  const name = user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : session?.user?.username;

  return (
    <DialogContent
      className="flex max-h-full flex-col items-center overflow-auto sm:max-w-[425px]"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle className="[text-wrap:balance]">
          Cześć, {name}! 👋
        </DialogTitle>
      </DialogHeader>

      <DialogDescription className="space-y-2 whitespace-pre-wrap text-foreground">
        <p className="text-center">
          Witamy Cię w aplikacji licytacyjnej postDA 2024 💒
        </p>
        <p className="text-balance text-center">
          W tym roku będziemy wspierać{" "}
          <a
            className="text-primary underline"
            href="https://fundacja-kapucynska.org/"
          >
            Fundację Kapucyńską
          </a>
          , która przy ul. Miodowej prowadzi jadłodajnię dla ludzi ubogich i
          bezdomnych oraz punkt wydawania leków i ubrań. 🍲 💊 👕 ❤️
        </p>
      </DialogDescription>

      <div className="flex items-center gap-2">
        <Checkbox
          id="dont_show_welcome_modal"
          checked={dontShowWelcomeModal}
          disabled={!user.last_name}
          onCheckedChange={handleCheckboxChange}
        />
        <label
          htmlFor="dont_show_welcome_modal"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nie pokazuj po otwarciu aplikacji
        </label>
      </div>
      <div className="-mt-2 text-xs text-muted-foreground">
        {!user.last_name &&
          "(aby zaznaczyć, musisz dodać swoje imię i nazwisko)"}
      </div>

      {!user.last_name && (
        <Button
          onClick={() => {
            router.push("/profile");
          }}
          className="w-full"
        >
          Przejdź do profilu
        </Button>
      )}
      <DialogClose asChild>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/")}
        >
          Zamknij
        </Button>
      </DialogClose>
    </DialogContent>
  );
};

export default WelcomeModal;
