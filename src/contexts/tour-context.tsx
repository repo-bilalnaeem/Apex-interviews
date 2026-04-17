"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TourContextType {
  restartTour: () => void;
  setRestartTour: (fn: () => void) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [restartTour, setRestartTour] = useState<() => void>(() => () => {});

  return (
    <TourContext.Provider value={{ restartTour, setRestartTour }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}