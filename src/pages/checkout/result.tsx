"use client";
import { site_details } from "@/config";
import { clearCart } from "@/utils/cartf";
import { clearCartServer } from "@/utils/cartfunctions";
import { useEffect, useState } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common','checkout'])),
    },
  };
}
export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{ status?: string; error?: string } | null>(null);
   let {t}=useTranslation(['checkout','common']);
  useEffect(() => {
    const storedOrderId = sessionStorage.getItem("order_id");
    if (storedOrderId) setOrderId(storedOrderId);

    const storedAppointee = sessionStorage.getItem("userinfo")
  
    if (storedAppointee) {
      console.log("in stored appointee try")
      try {
        const parsed = JSON.parse(storedAppointee);
        if (parsed.email) setEmail(parsed.email);
       
          if (storedOrderId && parsed.email && !checked) {
      setChecked(true);
      handleCheckStatus(storedOrderId, parsed.email);
    }
    else{

      
    }
      } catch (err) {
        console.error("Failed to parse appointee:", err);
      }
    }
    else{

      console.log("storedappointee isnot ");
    }
  }, []);
/*
  useEffect(() => {
    if (orderId && email && !checked) {
      setChecked(true);
      handleCheckStatus(orderId, email);
    }
  }, [orderId, email, checked]);
*/
  const handleCheckStatus = async (order_id: string, email: string) => {
  
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${site_details.curl}orders/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: parseInt(order_id, 10),
          email,
        }),
      });

      if (!res.ok) {
        setResult({ error: `Error ${res.status}: ${await res.text()}` });
        return;
      }

      const data = await res.json();
      setResult({ status: data.status });

      clearCartServer();
      clearCart();
    } catch (error: any) {
      setResult({ error: error.message || t("request_failed") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("order_status")}</h1>

      {loading && <p>{t("checking_status")}…</p>}

      {result && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <p className="text-green-600">{t("order_status")} {result.status}</p>
          )}
        </div>
      )}
    </div>
  );
}

