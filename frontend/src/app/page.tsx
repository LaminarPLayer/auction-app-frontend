"use client";

import AuctionsStats from "@/components/auctions-stats";
import CountdownTimer from "@/components/countdown-timer";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import WelcomeModal from "@/components/welcome-modal";
import { useWelcomeModal } from "@/lib/contexts/welcome-modal-context";
import { useUser } from "@/lib/hooks/useUser";
import { Info } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import AuctionList from "./auction-list";

export default function Home() {
  const { status } = useSession();
  const { user, isLoading } = useUser();
  const { welcomeModalOpen, setWelcomeModalOpen } = useWelcomeModal();

  if (status === "loading" || isLoading) return <Loader />;
  if (status === "unauthenticated")
    return (
      <div className="p-4 text-center">
        <Button
          variant="link"
          onClick={() => signIn("discord", { callbackUrl: "/" })}
          title="Zaloguj się"
        >
          <span>Zaloguj się, aby wziąć udział w licytacjach</span>
        </Button>
      </div>
    );

  return (
    <div className="container flex flex-col items-center justify-between gap-4 p-4">
      <CountdownTimer />
      {user && (
        <Dialog open={welcomeModalOpen} onOpenChange={setWelcomeModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <span className="flex items-center gap-2">
                <Info className="size-4" />
                Wyświetl wiadomość powitalną
              </span>
            </Button>
          </DialogTrigger>
          <WelcomeModal user={user} />
        </Dialog>
      )}
      <AuctionsStats />
      <Separator />
      <AuctionList />
    </div>
  );
}
