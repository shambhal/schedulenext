"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { site_details } from "@/config";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethodType {
  id: string;
  code: string;
  title: string;
}

interface PaymentMethodProps {
  onSelect: (method: string) => void;
  selected?: string;
 appointee?:any;
//  apiUrl: string; // Example: "/api/payment-methods"
}

export default function PaymentMethod({
  onSelect,
  selected: defaultSelected,
  appointee
}: PaymentMethodProps) {
  const [methods, setMethods] = useState<PaymentMethodType[]>([]);
  const [selected, setSelected] = useState(defaultSelected || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var url=site_details.url;
   var apiUrl=url+'payments/list';
    const fetchMethods = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch payment methods");
        const data = await res.json();
        setMethods(data); // Ensure API returns [{id, name, description}]
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect(id);
  };

  if (loading) return <p>Loading payment methods...</p>;

  if (!methods.length) return <p>No payment methods available.</p>;

  return (
    <Card className="w-full max-w-md  shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>

        <RadioGroup
          value={selected}
          name="payment_method"
          onValueChange={handleSelect}
          className="space-y-3"
        >
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center space-x-3 rounded-xl border p-3 hover:bg-gray-50 transition"
            >
              <RadioGroupItem value={method.code} id={method.code} />
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                <span className="font-medium">{method.title}</span>
                {method.title && (
                  <p className="text-sm text-gray-500">{method.title}</p>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          className="w-full mt-4"
          disabled={!selected 
            || !appointee}
          onClick={() => onSelect(selected)}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
