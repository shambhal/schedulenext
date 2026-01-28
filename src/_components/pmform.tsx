"use client";

import { useEffect, useState } from "react";
import { site_details } from "@/config";
interface FormFetcherProps {
  orderId: number;
  link: string; // API endpoint to fetch form
  onProcess:(link:string)=>void
}

export default function PaymentForm({ orderId, link ,onProcess}: FormFetcherProps) {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionUrl,setActionurl]=useState(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault(); // Prevent page reload
   try {
    await onProcess(actionUrl); // If onProcess is async
  } catch (err) {
    console.error("Error processing:", err);
  }
/*
    const res = await fetch(site_details.url+actionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    });

    const result = await res.json();
    
    console.log("Payment response:", result);
    */
  };
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
       
        const res = await fetch( site_details.url+link, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: orderId }),
        });

        if (!res.ok) throw new Error("Failed to fetch form");

        const data = await res.json();
        setFormData(data.form);
        setActionurl(data.actionurl);
      } 
     
      catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [orderId, link]);

  if (loading) return <div>Loading form...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Order Form</h3>
 
    <form onSubmit={handleSubmit}>
        <div 
      dangerouslySetInnerHTML={{ __html: formData }}
      />
    
</form>
      {/* Render your form fields based on `formData` */}
    </div>
  );
}
