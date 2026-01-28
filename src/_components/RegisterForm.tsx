import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { site_details } from "@/config";
import { toast } from "sonner"
interface RegisterFormProps {
  onSave: (user: any) => void;
}

export default function RegisterForm({ onSave }: RegisterFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  //const [registered,setRegistered]=useState(false);
  const handleRegister = async () => {
  try {
    const res = await fetch(`${site_details.url}checkout/register`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    // Always parse once
    const data = await res.json();

    if (res.ok) {
      if (data.refresh || data.access) {
        onSave({"id":data.customer_id,"name":data.name,"phone":data.phone,'access_token':data.access_token,"refresh_token":data.refresh_token});
      }
      if (data.error) {
        toast.error(data.error);
      }
    } else if (res.status === 422) {
      // FastAPI validation error format
      const newErrors: Record<string, string> = {};
      data.detail.forEach((err: any) => {
        const field = err.loc?.[1] ?? "form";
        newErrors[field] = err.msg;
      });
      setErrors(newErrors);
    } else {
      toast.error(data.detail || "Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error("Register failed:", err);
    toast.error("Network error. Please check your connection.");
  }
};


  return (
    <div className="space-y-2">
      <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
     {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
       {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
       {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      <Button className="text-md p-5 text-white bg-amber-500" onClick={handleRegister}>Register & Continue</Button>
    </div>
  );
}
