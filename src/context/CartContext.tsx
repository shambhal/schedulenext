// context/CartContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode ,useMemo} from "react"
type CartItem = {
  dated: string
  price: number
  slot:string
  id:number,
  user_id:number,
  doctor_name:string,
  category_name:string
}
type CartContextType = {
  CartCount: number,
  items:CartItem[],
subtotal: number,
  setCartCount: (count: number) => void
  setItems:(items:CartItem[])=>void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [CartCount, setCartCount] = useState(0)
  const [items, setItems] = useState<CartItem[]>([])
   const subtotal = useMemo(() => {
   
    //if(items.length==0)
      //return 0;
    
    return items.reduce((total, item) => total + item.price , 0)
  }, [items])
  return (
    <CartContext.Provider value={{ CartCount, setCartCount ,items,subtotal,setItems}}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
