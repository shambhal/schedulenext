// context/CheckoutContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from "react";

interface CheckoutContextType {
  orderId: number | null;
  setOrderId: (id: number | null) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [orderId, setOrderId] = useState<number | null>(null);

  return (
    <CheckoutContext.Provider value={{ orderId, setOrderId }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used within CheckoutProvider");
  return context;
}
