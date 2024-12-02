"use client";

import ChangeUserDataModal from "@/components/change-user-data-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/lib/hooks/useUser";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession({ required: true });
  const [open, setOpen] = useState(false);
  const { user, isLoading, isError } = useUser();

  if (status == "loading" || isLoading) {
    return (
      <div className="container mx-auto flex max-w-2xl justify-center p-6">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <div>Possibly not logged in</div>;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  if (!user) {
    return <div>Nothing to show.</div>;
  }

  return (
    <div className="container mx-auto mt-8 flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Image
            src={session?.picture || ""}
            alt="Your Discord avatar"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div className="space-y-1 text-center sm:text-left">
            {user.last_name ? (
              <>
                <h1 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>
                <h2 className="text-muted-foreground">
                  {session.user.username}
                </h2>
              </>
            ) : (
              <h1 className="text-2xl font-bold">{session.user.username}</h1>
            )}

            <p className="text-muted-foreground">
              {session.user.email || "No email provided"}
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edytuj imię i nazwisko
              </span>
            </Button>
          </DialogTrigger>
          <ChangeUserDataModal user={user} onSuccess={() => setOpen(false)} />
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">ID użytkownika</p>
            <p className="font-medium">{session.user.pk}</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Nazwa użytkownika na Discordzie
            </p>
            <p className="font-medium">{session.user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
