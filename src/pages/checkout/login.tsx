"use client";

import { useState, useTransition } from "react";
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

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const {t}=useTranslation(["common","checkout"]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const url = site_details.curl.replace(/\/$/, "");

    try {
      const res = await fetch(`${url}/checkout/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || t("login_successful"));
        // ✅ Store token if your API returns it
        if (data.access_token) {
          sessionStorage.setItem("token", data.access_token);
        }
        // ✅ Redirect (example: to dashboard or homepage)
        // window.location.href = "/";
      } else {
        setMessage(data.detail || data.message || t("invalid_credentials"));
      }
    } catch (err) {
      setMessage("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">Customer Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
     
    </div>
   
  );
}
