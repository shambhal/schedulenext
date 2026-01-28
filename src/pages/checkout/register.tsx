"use client";

import { useState } from "react";
import { site_details } from "@/config";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common','checkout'])),
    },
  };
}
export default function RegisterPage() {
  const {t}=useTranslation(["common","checkout"]);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error,setError]=useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  var url=site_details.curl;
    try {
      const res = await fetch(url+'checkout/register', {
        method: "POST",
          credentials: "include",  // 👈 IMPORTANT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if(res.ok)
      {
      const data = await res.json();
      setMessage(data.message || t("register_success"));
       setError(false);
    


      sessionStorage.setItem('user',data.user_info);
      
      }else{
         const data = await res.json();
         setError(true);
 setMessage(data.detail);

      }
    } catch (err) {
      setMessage(t("common:error_occured"));
    }

    setLoading(false);
  };

  return (<>
  <head><title>{t('checkout:heading_register')}</title></head>
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">{t("checkout:customer_reg")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder={t("checkout:field_name")}
                    value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("checkout:field_email")}
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder={t("checkout:field_mobile")}
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          pattern="[0-9]{10}" // basic validation for 10 digits
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t("checkout:field_password")}
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? t("text_registering") : t("checkout:text_register")}
        </button>
      </form>
    {message && (
  <p
    className={`mt-4 text-center ${
      error ? "text-red-600" : "text-green-600"
    }`}
  >
    {message}
  </p>
)}
    </div>
    </>
  );
}
