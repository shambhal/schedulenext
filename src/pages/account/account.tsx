"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/_components/LoginForm";
import RegisterPage from "@/_components/RegisterForm";
import { site_details } from "@/config";
import  {UserInfo}  from "@/lib/utils";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common','account'])),
    },
  };
}
export default function AccountPage() {
  const router = useRouter();
  const {t}=useTranslation(["account","common"])
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const handleLogin = async (user: UserInfo) => {

sessionStorage.setItem("userinfo", JSON.stringify(user));
    if (user.access_token) {
      sessionStorage.setItem("access_token", user.access_token);
      sessionStorage.setItem("refresh_token", user.refresh_token || "");
    }
    router.replace('/account/dashboard');
  } 
  useEffect(() => {
    // Call backend to check auth using the cookie
    fetch(site_details.url + "auth/me", {
      credentials: "include",  // ✅ sends cookie
    })
      .then(async (res) => {
        if (res.ok) {
          // user is authenticated → redirect
          console.log(res);
          alert("e");
          router.replace("/dashboard");
        } else {
          // not logged in → show login/register
          setCheckingAuth(false);
        }
      })
      .catch(() => setCheckingAuth(false));
  }, [router]);

  if (checkingAuth) return <p className="p-8 text-center">{t("text_checking_auth")}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2 rounded ${
            activeTab === "login" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-2 rounded ${
            activeTab === "register" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Register
        </button>
      </div>

      {activeTab === "login" ? <LoginForm onLogin={handleLogin} /> : <RegisterPage onSave={handleLogin}      />}
    </div>
  );
}
