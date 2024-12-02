"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                onClick={() => router.push("/profile")}
                title="Profil"
                variant={"outline"}
                className="pr-0"
              >
                {session.user.username}
                <Avatar className="ml-3">
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
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                Wyloguj się
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
