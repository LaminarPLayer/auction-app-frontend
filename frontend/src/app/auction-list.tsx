"use client";

import AuctionCard from "@/components/auction-card";
import { Auction } from "@/lib/types/auction";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";

const AuctionList = () => {
  const { data: session } = useSession();

  const fetcher = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        headers: { Authorization: "Bearer " + session?.access_token },
      })
      .then((res) => res.data);

  const { data, error, isLoading } = useSWR<Auction[]>(`auction/list`, fetcher);

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Failed to load data</div>;

  if (data.length === 0 || true)
    return (
      <div>
        Ups, lista auckji jest pusta… Może chcesz{" "}
        <Link
          href="/auction/add"
          className="underline underline-offset-4 hover:opacity-90"
        >
          dodać jakąś aukcję
        </Link>
        ? 😉
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data
          .sort((a, b) => b.id - a.id)
          .map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
      </div>
    </div>
  );
};

export default AuctionList;
