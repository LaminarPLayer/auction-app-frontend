"use client";

import { Auction } from "@/lib/types/auction";
import axios from "axios";
import { Session } from "next-auth";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { Bid } from "./auction-component";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const BidsSection = ({
  auction,
  bids,
  numOfWinners,
  session,
  mutate,
}: {
  auction: Auction;
  bids: Bid[];
  numOfWinners: number;
  session?: Session | null;
  mutate: KeyedMutator<any>;
}) => {
  const handleBid = async (bidValue: number | undefined) => {
    if (!bidValue) return;
    await axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "bid/",
      headers: { Authorization: "Bearer " + session?.access_token },
      data: { auction_id: auction.id, value: bidValue },
    });
    mutate();
  };

  const calcMinNewBidValue = () => {
    if (!auction.min_bid_value) return 10;
    if (!bids?.length) return auction.min_bid_value;
    return bids[0].value + 10;
  };

  const minNewBidValue = calcMinNewBidValue();

  const [bidValue, setBidValue] = useState<number>(minNewBidValue);

  return (
    <div>
      <div className="flex flex-col items-center gap-1">
        {!bids || !bids.length ? (
          <p className="text-sm text-muted-foreground">
            Na razie nie ma licytujących
          </p>
        ) : (
          (bids ? bids : []).map((bid, index) => {
            const isWinner = index < numOfWinners;
            const isUser = bid.bidder_id === session?.user?.pk;

            return (
              <>
                {index !== 0 ? <Separator /> : null}
                <div className="flex w-full items-center justify-between gap-5">
                  <div
                    className={`${isWinner ? "font-bold" : "font-medium"} ${
                      isUser ? "underline" : ""
                    }`}
                  >
                    {bid.bidder_firstname} {bid.bidder_lastname}
                  </div>
                  <Badge
                    variant={isWinner ? "default" : "outline"}
                    className="whitespace-nowrap"
                  >
                    {bid.value.toLocaleString("pl")} zł
                  </Badge>
                </div>
              </>
            );
          })
        )}
      </div>
      {auction.user !== session?.user?.pk ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-2">
            <Label htmlFor="bid">Twoja oferta:</Label>
            <div className="flex items-baseline gap-2">
              <Input
                type="number"
                id="bid"
                value={bidValue || ""}
                onChange={(e) => setBidValue(e.target.valueAsNumber)}
                className="w-28 pr-1 text-right"
              />
              <span>zł</span>
            </div>
          </div>
          <Button
            onClick={() => {
              handleBid(bidValue);
            }}
            disabled={
              !bidValue ||
              bidValue < minNewBidValue ||
              (bids?.length > 0 && bids[0].bidder_id === session?.user?.pk)
            }
          >
            Licytuj
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default BidsSection;