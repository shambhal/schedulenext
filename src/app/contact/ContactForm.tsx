"use client";

import MyButton from "@/_components/button";
import Mylabel from "@/_components/label";
import MyText from "@/_components/text";

import { useEffect, useState } from "react";
import { site_details } from "@/config";
import { useTranslations } from 'next-intl';

export default function ContactForm() {

  const t = useTranslations();

  const [form, setForm] = useState({
    name: "",
    email: "",
    query: "",
    captcha_input: ""
  });

  const [captcha, setCaptcha] = useState("");
  const [errors, setError] = useState({
    captcha_input: '',
    name: '',
    email: '',
    query: ''
  });

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const res = await fetch(site_details.curl + "utils/captcha", {
        credentials: "include",
      });

      const data = await res.json();
      setCaptcha(data.captcha);

    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(site_details.curl + "utils/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + data.detail);
      } else {
        alert("Success: " + data.message);

        // reset form (optional)
        setForm({
          name: "",
          email: "",
          query: "",
          captcha_input: ""
        });

        fetchCaptcha();
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray mt-2 pt-5 container px-5">

      <div className="grid grid-cols-2 gap-6">

        <div>
          <img
            src='/bgs/contact-bg.svg'
            className="bg-contain h-2/3"
            alt="contact"
          />
        </div>

        <div>
          <h1>{t('contact.contact')}</h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            <div>
              <Mylabel title={t('contact.name')} />
              <MyText name="name" onchange={handleChange} value={form.name} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <Mylabel title={t("contact.email")} />
              <MyText name="email" type="email" onchange={handleChange} value={form.email} />
            </div>

            <div>
              <Mylabel title={t("contact.query")} />
              <textarea
                rows={2}
                name="query"
                onChange={handleChange}
                value={form.query}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
              />
            </div>

            <div>
              <Mylabel title={t("contact.enter_code")} />
              <div className="flex items-center gap-2">
                <span>{captcha}</span>
                <MyText name="captcha_input" onchange={handleChange} value={form.captcha_input} />
              </div>
              {errors.captcha_input && (
                <p className="text-red-500 text-sm">{errors.captcha_input}</p>
              )}
            </div>

            <div className="my-2">
              <MyButton title={t("contact.button_send")} />
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}