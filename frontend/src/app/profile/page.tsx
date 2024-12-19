"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/hooks/useUser";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession({ required: true });
  const { user, isLoading, isError, mutate } = useUser();

  // Add state for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Add handler for user data changes
  const handleUserDataChange = async () => {
    await axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "user/change_details",
      headers: { Authorization: "Bearer " + session?.access_token },
      data: { first_name: firstName, last_name: lastName },
    });
    toast({
      title: "Ustawiono imię i nazwisko",
    });
    mutate();
  };

  // Set initial form values when user data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
    }
  }, [user]);

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
    <div className="container mx-auto mt-8 flex max-w-2xl flex-col items-center gap-8">
      {/* Profile Overview Section */}
      <section className="w-full">
        <h2 className="mb-6 text-xl font-semibold">Profil użytkownika</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
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
                  <h1 className="text-2xl font-bold">
                    {session.user.username}
                  </h1>
                )}

                <p className="text-muted-foreground">
                  {session.user.email || "No email provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Section */}
      <section className="w-full">
        <h2 className="mb-6 text-xl font-semibold">Edycja danych</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <form
            className="w-full max-w-md space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await handleUserDataChange();
            }}
          >
            <div className="space-y-2">
              <Label className="whitespace-nowrap" htmlFor="first_name">
                Imię: *
              </Label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                value={firstName || ""}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="whitespace-nowrap" htmlFor="last_name">
                Nazwisko: *
              </Label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                value={lastName || ""}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!firstName?.trim() || !lastName?.trim()}
              className="w-full"
            >
              Zapisz zmiany
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
