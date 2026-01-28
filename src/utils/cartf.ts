"use client"
import { generateUUID, site_details } from "@/config";
import { useCart } from "@/context/CartContext"
export async function fetchCart() {
  const uuid = sessionStorage.getItem('UUID') || generateUUID();
  sessionStorage.setItem('UUID', uuid);

  const url = site_details.curl + 'cart/getcart';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid }),
    });

    if (!res.ok) return { count: -1, items: [] };
        // console.log("res is ok");
    const json = await res.json();
    console.log(json.items);
    console.log(json.length)
    const count = Array.isArray(json['items']) ? json['items'].length :  0;
   
    sessionStorage.setItem('carttotal', String(count));
    sessionStorage.setItem("cart_items",json);
    return { count, items: json['items'] };
  } catch (err) {
    console.error("fetchCart error:", err);
    return { count: -1, items: [] };
  }
}
export async function clearCart()
{

sessionStorage.removeItem('carttotal');
sessionStorage.removeItem('cart_items');
}