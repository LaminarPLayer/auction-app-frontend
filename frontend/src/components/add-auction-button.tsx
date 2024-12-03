"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AddAuctionButton() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      {session ? (
        <Button
          variant="default"
          className="flex gap-2"
          size="default"
          title="Utwórz aukcję"
          onClick={() => router.push("/auction/add")}
        >
          <Plus className="h-5 w-5" />
          <span>Utwórz aukcję</span>
        </Button>
      ) : null}
    </>
  );
}
