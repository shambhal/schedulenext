"use client";
import {toast} from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { getUUID, site_details } from "@/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertDate, convertRangeToAmPm } from "@/utils/formatcurr";
import Link from "next/link";
import { useState } from "react";
import {clearCartServer} from "@/utils/cartfunctions"
import { useSonner } from "sonner";
export function CartSheet() {
  const { CartCount, items, subtotal, setItems, setCartCount } = useCart();
  const [open, setOpen] = useState(false); // control sheet open/close

  const updateCart = async (endpoint: string, body: any) => {
    try {
      const response = await fetch(`${site_details.url}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      if (data.items) {
        setItems(data.items);
        setCartCount(data.count);
      }
      else
      {
setItems([]);
setCartCount(0);

      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const deleteItem = (id: number) => {
    updateCart("cart/delete", { uuid: getUUID(), id });
  };

  const clearCart = async () => {
   // updateCart("cart/clear", { uuid: getUUID() });


  
    const result = await clearCartServer();

    if (result.success) {
    setItems([]);
setCartCount(0);

    } else {
      toast.error(result.error); // or show toast error
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-red-600">
          View Cart ({CartCount})
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[350px] sm:w-[400px]">
        <ScrollArea className="h-full p-6">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>

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
                    <p className="text-sm">
                      {item.category_name} {item.doctor_name}
                    </p>
                    <p className="text-sm">
                      {convertDate(item.dated)} – {convertRangeToAmPm(item.slot)}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>₹{item.price}</span>
                      <Button
                        variant="link"
                        className="text-red-500 p-0 h-auto"
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  className="flex-1 bg-red-800 text-white"
                  variant="destructive"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Link
                  href="/checkout/checkout"
                  className=" flex-1"
                  onClick={() => setOpen(false)} // close sheet on checkout
                >
                  <Button className="w-full bg-green-800 text-white">Checkout</Button>
                </Link>
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  }



  
