"use client";

import ChangeUserDataModal from "@/components/change-user-data-modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/lib/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

export default function Profile() {
  const { data: session, status } = useSession({ required: true });
  const [open, setOpen] = useState(false);

  const fetcher = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        headers: { Authorization: "Bearer " + session?.access_token },
      })
      .then((res) => res.data);

  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(`api/auth/user/`, fetcher);

  const user = userData as User;

  console.log(userData, error, isLoading);

  if (status == "loading") {
    return <div className="h-4 w-4 animate-spin bg-primary"></div>;
  }

  if (session) {
    return (
      <div>
        {userData ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="cursor-pointer">
              zmień dane
            </DialogTrigger>
            <ChangeUserDataModal user={user} onSuccess={() => setOpen(false)} />
          </Dialog>
        ) : null}

        <div>
          <span>PK: {session.user.pk}</span>
          <span>Username: {session.user.username}</span>
          <span>Email: {session.user.email || "Not provided"}</span>
        </div>
      </div>
    );
  }
}
