"use client";

import { AuctionsSortOptions } from "@/app/auction-list";
import { ArrowDownNarrowWide } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AuctionsSort = ({
  selectedSortOption,
  setSelectedSortOption,
}: {
  selectedSortOption: AuctionsSortOptions;
  setSelectedSortOption: (value: AuctionsSortOptions) => void;
}) => {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-1 sm:w-auto">
      <div className="flex w-20 items-center gap-1">
        <ArrowDownNarrowWide className="h-5 w-5" />
        Sortuj:
      </div>
      <Select
        defaultValue={selectedSortOption}
        onValueChange={(value) => {
          setSelectedSortOption(value as AuctionsSortOptions);
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Sortuj" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">od najnowszych 👶</SelectItem>
          <SelectItem value="oldest">od najstarszych 👴</SelectItem>
          <SelectItem value="cheapest">od najtańszych 🧅</SelectItem>
          <SelectItem value="expensive">od najdroższych 🤑</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AuctionsSort;
