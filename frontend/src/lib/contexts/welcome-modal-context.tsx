"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface WelcomeModalContextType {
  welcomeModalOpen: boolean;
  setWelcomeModalOpen: (open: boolean) => void;
}

const WelcomeModalContext = createContext<WelcomeModalContextType | undefined>(
  undefined,
);

export function WelcomeModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  useEffect(() => {
    const dontShowWelcomeModal = localStorage.getItem(
      "dont_show_welcome_modal",
    );
    if (dontShowWelcomeModal) {
      setWelcomeModalOpen(false);
    } else {
      setWelcomeModalOpen(true);
    }
  }, []);

  return (
    <WelcomeModalContext.Provider
      value={{ welcomeModalOpen, setWelcomeModalOpen }}
    >
      {children}
    </WelcomeModalContext.Provider>
  );
}

export function useWelcomeModal() {
  const context = useContext(WelcomeModalContext);
  if (context === undefined) {
    throw new Error(
      "useWelcomeModal must be used within a WelcomeModalProvider",
    );
  }
  return context;
}
