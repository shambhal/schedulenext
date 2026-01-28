
"use client";
import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {site_details} from "@/config"

interface GuestCheckoutProps {
  onSave: (user: any) => void;
}
export default function GuestCheckout({ onSave }: GuestCheckoutProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 useEffect(() => {
   
   var uinfo=   sessionStorage.getItem("userinfo")
   if(uinfo)
   {
      setForm(JSON.parse(uinfo));
   }
 
   
  }, []);
  const handleSave = async () => {
    setErrors({}); // clear old errors
    const res = await fetch(`${site_details.url}checkout/guest-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.detail) {
        const newErrors: Record<string, string> = {};
        data.detail.forEach((err: any) => {
          const field = err.loc[1]; // "name", "email", or "phone"
          newErrors[field] = err.msg;
        });
        setErrors(newErrors);
      }
      return;
    }

    // success logic here
    console.log("Form submitted successfully!");
    onSave({user_id:0 ,...form});
  };

  return (
    <div className="space-y-2">
      <div>
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <Button className=" bg-amber-500 text-white text-md" onClick={handleSave}>Continue as Guest</Button>
    </div>
  );
}
