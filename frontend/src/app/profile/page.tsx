"use client";

import ChangeUserDataModal from "@/components/change-user-data-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/lib/hooks/useUser";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession({ required: true });
  const [open, setOpen] = useState(false);
  const { user, isLoading, isError } = useUser();

  if (status == "loading" || isLoading) {
    return <div className="h-4 w-4 animate-spin bg-primary"></div>;
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="cursor-pointer">
          <Button>Zmień dane</Button>
        </DialogTrigger>
        <ChangeUserDataModal user={user} onSuccess={() => setOpen(false)} />
      </Dialog>

      <div>
        <span>PK: {session.user.pk}</span>
        <span>Username: {session.user.username}</span>
        <span>Email: {session.user.email || "Not provided"}</span>
      </div>
    </div>
  );
}
