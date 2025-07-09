"use client";
import MyButton from "@/_components/button";
import Mylabel from "@/_components/label"
import MyText from "@/_components/text"


import { useEffect, useState } from "react";
import { site_details } from "@/config";
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", query: "", captcha_input: "" });
  const [captcha, setCaptcha] = useState("");
const [errors,seterror]=useState({'captcha_input':'','name':'','email':'','query':''});
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    let url1=site_details.url;
    const res = await fetch(url1+"utils/captcha", {
      credentials: "include", // Required to receive the captcha cookie
    });
    const data = await res.json();
    setCaptcha(data.captcha); // e.g., "4 X 5"
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  let url1=site_details.url;
    const res = await fetch(url1+"utils/contact", {
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
    }
  };


return (<>
<div className="bg-gray mt-2 pt-5 container px-5">

    <div className="grid grid-cols-2">
     <div><img src='./bgs/contact-bg.svg' className="bg-contain h-2/3 text-amber-200"/></div>
    <div><h1>Contact page</h1>
      <form method="post"  onSubmit={handleSubmit} className="space-y-8" >
    <div><Mylabel title="Name"></Mylabel>
    <MyText name="name" onchange={handleChange} value={form.name} id="name"/>
    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
    </div>

 <div ><Mylabel title="Email"></Mylabel>
    <MyText name="email" type="email" onchange={handleChange} value={form.email} id="email"/>
    
    </div>
 <div ><Mylabel title="Query"></Mylabel>
    <textarea rows={2} name="query" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.query} />

    </div>
   <div><Mylabel title="Enter the code given below"></Mylabel>
    {captcha}  <MyText name="captcha_input" onchange={handleChange} value={form.captcha_input}  id="captcha"/>
    {errors.captcha_input && <p className="text-red-500 text-sm">{errors.captcha_input}</p>}
    
    </div>
    <div className="my-2">
     <MyButton title="Send" />
    </div>
</form>
</div>

    </div>

</div>{/*-- bg gray --> */}

</>)


}