"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

import { generateUUID, site_details ,getUUID} from "@/config";
import { ScrollArea } from "@/components/ui/scroll-area"
import { convertDate,convertRangeToAmPm } from "@/utils/formatcurr"
import Link from "next/link";
export default function CartDiv() {
  const {CartCount, items=[], subtotal } = useCart()



  return (
    <div>
        <div className="mt-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="text-sm">{item.category_name} {item.doctor_name} </p>
                  <p className="text-sm">{convertDate(item.dated)}-{convertRangeToAmPm(item.slot)}</p>

                  <p className="text-sm text-gray-500">
                 ₹{item.price} 
                  </p>
                </div>
                
              </div>
            ))
          )}
        </div>

       </div>
      
  )
}
