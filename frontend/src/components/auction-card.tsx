import { isValidUrl } from "@/lib/is-valid-url";
import { Auction } from "@/lib/types/auction";
import Linkify from "linkify-react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BidComponent from "./bid-component";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const AuctionCard = ({
  auction,
  isWinning,
  isBidding,
  userId,
}: {
  auction: Auction;
  isBidding: boolean;
  isWinning: boolean;
  userId?: number;
}) => {
  const auctionStatus =
    isBidding && isWinning
      ? "winning"
      : isBidding
      ? "losing"
      : userId && auction.user === userId
      ? "own"
      : "not-bidding";

  // const cardBorderClass =
  //   auctionStatus === "winning"
  //     ? `border-2 border-green-500`
  //     : auctionStatus === "losing"
  //     ? `border-2 border-red-500`
  //     : auctionStatus === "own"
  //     ? `border-2 border-primary`
  //     : "";
  const cardBorderClass = "";

  const badgeColorClass =
    auctionStatus === "winning"
      ? `bg-green-500`
      : auctionStatus === "losing"
      ? `bg-red-500`
      : auctionStatus === "own"
      ? `bg-primary`
      : "";

  const badgeText =
    auctionStatus === "winning"
      ? "Wygrywasz tę aukcję!"
      : auctionStatus === "losing"
      ? "Przegrywasz tę aukcję!"
      : auctionStatus === "own"
      ? "To Twoja aukcja ;)"
      : "Nie licytujesz tej aukcji";

  return (
    <Link href={`/auction/${auction.id}`}>
      <Card
        className={`relative grid h-full grid-cols-1 overflow-hidden ${cardBorderClass} transition-colors hover:bg-accent`}
      >
        <div className="relative aspect-video w-full">
          {isValidUrl(auction.photo_url) ? (
            <Image
              className="object-cover"
              src={auction.photo_url}
              alt={auction.title}
              fill={true}
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-primary-foreground/50 object-cover">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="[text-wrap:balance]">{auction.title}</CardTitle>
          <p>
            <span className="italic">
              {auction.user_firstname}
              {auction.user_lastname ? ` ${auction.user_lastname}` : ""}
            </span>{" "}
            • do{" "}
            {auction.auction_end_data
              ? new Date(auction.auction_end_data).toLocaleString("pl-PL", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })
              : ""}
          </p>
        </CardHeader>
        <CardContent className="pb-3">
          <CardDescription className="line-clamp-2 whitespace-pre-wrap">
            <Linkify
              as="div"
              className="whitespace-pre-wrap"
              options={{
                defaultProtocol: "https",
                className: "underline break-all",
                tagName: "span",
              }}
            >
              {auction.description}
            </Linkify>
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 self-end pb-4">
          {auction.top_bidder_firstname && auction.top_bid_value ? (
            <BidComponent
              bid={{
                bidder_firstname: `🥇 ${auction.top_bidder_firstname}`,
                bidder_lastname: auction.top_bidder_lastname
                  ? auction.top_bidder_lastname
                  : "",
                value: auction.top_bid_value,
                bidder_id: 0, // ask G to add this to the API
              }}
              isWinner={true}
              isUser={false}
            />
          ) : (
            <BidComponent
              bid={{
                bidder_firstname: "Cena wywoławcza:",
                bidder_lastname: "",
                value: auction.min_bid_value ? auction.min_bid_value : 10,
                bidder_id: 0,
              }}
              isWinner={false}
              isUser={false}
            />
          )}
          <Badge
            variant={
              auctionStatus !== "not-bidding" ? "defaultNoHover" : "outline"
            }
            className={`w-full justify-center ${badgeColorClass}`}
          >
            {badgeText}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AuctionCard;
