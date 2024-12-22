"use client";

import {createContext, useContext} from "react";
import {Database} from "@/database.types";

type Barbershop = Database["public"]["Tables"]["barbershops"]["Row"];

interface BarbershopContextType {
  barbershop: Barbershop;
}

const BarbershopContext = createContext<BarbershopContextType | undefined>(undefined);

export function BarbershopProvider({children, barbershop}: {children: React.ReactNode; barbershop: Barbershop}) {
  return <BarbershopContext.Provider value={{barbershop}}>{children}</BarbershopContext.Provider>;
}

export function useBarbershop() {
  const context = useContext(BarbershopContext);
  if (context === undefined) {
    throw new Error("useBarbershop must be used within a BarbershopProvider");
  }
  return context;
}
