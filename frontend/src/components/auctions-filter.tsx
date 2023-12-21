"use client";

import { AuctionsFilterOptions } from "@/app/auction-list";
import { Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const AuctionsFilter = ({
  selectedOption,
  setSelectedOption: onChange,
}: {
  selectedOption: AuctionsFilterOptions;
  setSelectedOption: (value: AuctionsFilterOptions) => void;
}) => {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-1 sm:w-auto">
      <div className="flex w-20 items-center gap-1">
        <Filter className="h-5 w-5" /> Filtruj:
      </div>
      <Tabs defaultValue={selectedOption} className="justify-center">
        <TabsList className="flex justify-center">
          <TabsTrigger
            value={AuctionsFilterOptions.All}
            onClick={() => {
              onChange(AuctionsFilterOptions.All);
            }}
          >
            Wszystkie
          </TabsTrigger>
          <TabsTrigger
            value={AuctionsFilterOptions.My}
            onClick={() => {
              onChange(AuctionsFilterOptions.My);
            }}
          >
            Oferuję
          </TabsTrigger>
          <TabsTrigger
            value={AuctionsFilterOptions.Bid}
            onClick={() => {
              onChange(AuctionsFilterOptions.Bid);
            }}
          >
            Licytuję
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AuctionsFilter;
