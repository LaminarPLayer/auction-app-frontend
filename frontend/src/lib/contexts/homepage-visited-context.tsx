"use client";

import { createContext, useContext, useState } from "react";

type HomepageVisitedContextType = {
  hasVisitedHomepage: boolean;
  setHasVisitedHomepage: (value: boolean) => void;
};

const HomepageVisitedContext = createContext<
  HomepageVisitedContextType | undefined
>(undefined);

export function HomepageVisitedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasVisitedHomepage, setHasVisitedHomepage] = useState(false);

  return (
    <HomepageVisitedContext.Provider
      value={{ hasVisitedHomepage, setHasVisitedHomepage }}
    >
      {children}
    </HomepageVisitedContext.Provider>
  );
}

export function useHomepageVisited() {
  const context = useContext(HomepageVisitedContext);
  if (context === undefined) {
    throw new Error(
      "useHomepageVisited must be used within a HomepageVisitedProvider",
    );
  }
  return context;
}
