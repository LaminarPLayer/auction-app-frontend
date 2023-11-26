"use client";

import { Button } from "@/components/ui/button";
import { Heart, LogIn, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status == "loading") {
    return (
      <Button variant="outline" size={"icon"} disabled={true}>
        <Heart className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  // if (session) {
  //   router.push("/temp/profile");
  //   return;
  // }

  return (
    <>
      {session ? (
        <>
          <Button
            variant="outline"
            onClick={() => router.push("temp/profile")}
            size={"icon"}
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            className="flex gap-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <span>Sign out</span>
            <LogOut className="h-5 w-5" />
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          className="flex gap-2"
          onClick={() => signIn(undefined, { callbackUrl: "/temp/profile" })}
        >
          <LogIn className="h-5 w-5" />
          <span>Sign in</span>
        </Button>
      )}
    </>
  );
}
