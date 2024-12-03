"use client";

import ChangeUserDataModal from "@/components/change-user-data-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/lib/hooks/useUser";
import { Loader2, UserPen } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession({ required: true });
  const [open, setOpen] = useState(false);
  const { user, isLoading, isError, mutate } = useUser();

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
    <div className="container mx-auto mt-8 flex max-w-2xl flex-col items-center gap-6">
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
      </div>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <span className="flex items-center gap-2">
                <UserPen className="size-4" />
                Edytuj imię i nazwisko
              </span>
            </Button>
          </DialogTrigger>
          <ChangeUserDataModal
            user={user}
            onSuccess={() => {
              setOpen(false);
              mutate();
            }}
          />
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
