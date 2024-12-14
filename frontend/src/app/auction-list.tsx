"use client";

import AuctionCard from "@/components/auction-card";
import AuctionsFilter from "@/components/auctions-filter";
import AuctionsSort from "@/components/auctions-sort";
import { Loader } from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Auction } from "@/lib/types/auction";
import axios from "axios";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { useBiddingAuctions, useWinningAuctions } from "./swr/use-auctions";

export enum AuctionsFilterOptions {
  My = "my",
  All = "all",
  Bid = "bid",
}

export enum AuctionsSortOptions {
  Newest = "newest",
  Oldest = "oldest",
  Cheapest = "cheapest",
  Expensive = "expensive",
}

const AuctionList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState<AuctionsFilterOptions>(
    () => {
      const filter = searchParams.get("filter");

      if (filter === AuctionsFilterOptions.My) {
        return AuctionsFilterOptions.My;
      } else if (filter === AuctionsFilterOptions.Bid) {
        return AuctionsFilterOptions.Bid;
      } else {
        return AuctionsFilterOptions.All;
      }
    },
  );

  const handleSetSelectedOption = useCallback(
    (option: AuctionsFilterOptions) => {
      setSelectedOption(option);
      router.push(pathname + "?" + createQueryString("filter", option));
    },
    [createQueryString, pathname, router],
  );

  const [selectedSortOption, setSelectedSortOption] =
    useState<AuctionsSortOptions>(() => {
      const sort = searchParams.get("sort");

      if (sort === AuctionsSortOptions.Newest) {
        return AuctionsSortOptions.Newest;
      } else if (sort === AuctionsSortOptions.Oldest) {
        return AuctionsSortOptions.Oldest;
      } else if (sort === AuctionsSortOptions.Cheapest) {
        return AuctionsSortOptions.Cheapest;
      } else if (sort === AuctionsSortOptions.Expensive) {
        return AuctionsSortOptions.Expensive;
      } else {
        return AuctionsSortOptions.Newest;
      }
    });

  const handleSetSelectedSortOption = useCallback(
    (option: AuctionsSortOptions) => {
      setSelectedSortOption(option);
      router.push(pathname + "?" + createQueryString("sort", option));
    },
    [createQueryString, pathname, router],
  );

  const auctionsFetcher = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        headers: { Authorization: "Bearer " + session?.access_token },
      })
      .then((res) => res.data);

  const {
    data: auctions,
    error,
    isLoading,
  } = useSWR<Auction[]>(`auction/list`, auctionsFetcher);

  const { biddingAuctions: biddingAuctions } = useBiddingAuctions(
    session?.access_token || "",
  );

  const { winningAuctions } = useWinningAuctions(session?.access_token || "");

  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get("search") || "";
  });

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      router.push(pathname + "?" + createQueryString("search", query));
    },
    [createQueryString, pathname, router],
  );

  if (isLoading) return <Loader />;

  if (!auctions) return <div>Failed to load data</div>;

  if (auctions.length === 0)
    return (
      <div className="text-center">
        Ups! Lista aukcji jest pusta… Może chcesz{" "}
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
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-1">
          <div className="flex w-20 grow-0 items-center gap-1">
            <Search className="h-5 w-5" /> Szukaj:
          </div>
          <Input
            type="search"
            className="w-auto grow"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Blur the input to hide the keyboard
                e.currentTarget.blur();
              }
            }}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between">
          <AuctionsFilter
            selectedOption={selectedOption}
            setSelectedOption={handleSetSelectedOption}
          />
          <AuctionsSort
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={handleSetSelectedSortOption}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {auctions
          .filter((auction) => {
            const matchesSearch = searchQuery
              ? auction.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                auction.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              : true;

            if (selectedOption === AuctionsFilterOptions.My) {
              return matchesSearch && auction.user === session?.user?.pk;
            } else if (selectedOption === AuctionsFilterOptions.Bid) {
              return (
                matchesSearch && biddingAuctions?.auctions?.includes(auction.id)
              );
            } else {
              return matchesSearch;
            }
          })
          .sort((a, b) => {
            if (selectedSortOption === AuctionsSortOptions.Newest) {
              return b.id - a.id;
            } else if (selectedSortOption === AuctionsSortOptions.Oldest) {
              return a.id - b.id;
            } else if (selectedSortOption === AuctionsSortOptions.Cheapest) {
              const aBid = a.top_bid_value || a.min_bid_value || 0;
              const bBid = b.top_bid_value || b.min_bid_value || 0;
              return aBid - bBid;
            } else if (selectedSortOption === AuctionsSortOptions.Expensive) {
              const aBid = a.top_bid_value || a.min_bid_value || 0;
              const bBid = b.top_bid_value || b.min_bid_value || 0;
              return bBid - aBid;
            } else {
              return b.id - a.id;
            }
          })
          .map((auction) => {
            return (
              <AuctionCard
                key={auction.id}
                auction={auction}
                isBidding={
                  !!biddingAuctions?.auctions.find((a) => a === auction.id)
                }
                isWinning={
                  !!winningAuctions?.auctions.find((a) => a === auction.id)
                }
                userId={session?.user?.pk}
              />
            );
          })}
      </div>
    </div>
  );
};

export default AuctionList;
