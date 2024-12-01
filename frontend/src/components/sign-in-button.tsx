"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/useUser";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SignInButton() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user } = useUser();

  if (status == "loading") {
    return (
      <Button variant="outline" size={"icon"} disabled={true}>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  return (
    <>
      {session ? (
        <>
          <button onClick={() => router.push("/profile")} title="Profil">
            <Avatar>
              <AvatarImage src={session.picture || ""} />
              <AvatarFallback>
                {(
                  (user?.first_name?.[0] || "") +
                    (user?.last_name?.[0] || "") ||
                  session.user.username?.[0] ||
                  "U"
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          <Button
            variant="outline"
            className="flex gap-2"
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Wyloguj się"
          >
            <span>Wyloguj się</span>
            <LogOut className="h-5 w-5" />
          </Button>
        </>
      ) : (
        <Button
          variant="default"
          className="flex gap-2"
          onClick={() => signIn("discord", { callbackUrl: "/" })}
          title="Zaloguj się"
        >
          <LogIn className="h-5 w-5" />
          <span>Zaloguj się</span>
        </Button>
      )}
    </>
  );
}
