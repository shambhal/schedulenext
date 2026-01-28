import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { site_details } from "@/config";
import {toast} from "sonner"
interface LoginFormProps {
  onLogin: (user: any) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [step, setStep] = useState<"password" | "otpRequest" | "otpVerify">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handlePasswordLogin = async () => {
    const res = await fetch(`${site_details.url}checkout/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
     var data = await res.json();
     console.log(data);
      if(data['id'])
      {
      var data2={"id":data.id,'email':data.email,"name":data.name,"phone":data.phone,'access_token':data.access_token,"refresh_token":data.refresh_token}
      onLogin(data2);

      }
      else{


        toast.error("Error Occured while saving")
      }
    }
    else{

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
  };

  const handleRequestOtp = async () => {
    await fetch(`${site_details.url}user/send-otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    setStep("otpVerify");
  };

  const handleVerifyOtp = async () => {
    const res = await fetch(`${site_details.url}user/verify-otp`, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      onLogin(data);
    }
  };

  return (
    <div className="space-y-2">
      <Input placeholder="Email or Phone" value={email} onChange={(e) => setEmail(e.target.value)} />
    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      {step === "password" && (
        <>
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        <div className="md:grid-cols-2 grid">
      <div className="w-1/2">   <Button onClick={handlePasswordLogin}  className="bg-amber-500 w-full text-white" >Login</Button></div>
        <div className="w-1/2">   <Button variant="link" className="bg-amber-500 text-white" onClick={() => setStep("otpRequest")}>
            Forgot password? Login with OTP
          </Button>
          </div>
          </div>
        </>
      )}

      {step === "otpRequest" && (
        <Button onClick={handleRequestOtp}  className="bg-amber-500 text-white" >Send OTP</Button>
      )}

      {step === "otpVerify" && (
        <>
          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button  className="bg-amber-500 text-white"  onClick={handleVerifyOtp}>Verify OTP & Login</Button>
        </>
      )}
    </div>
  );
}
