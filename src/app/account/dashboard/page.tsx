"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { site_details } from "@/config";
import  {UserInfo}  from "@/lib/utils";


import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const router = useRouter();
    const t=useTranslations();
  const [checkingAuth, setCheckingAuth] = useState(true);
const [uinfo, setUinfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Call backend to check auth using the cookie
     const storedUser = sessionStorage.getItem("userinfo");
      if(storedUser)
      {

      setUinfo(JSON.parse(storedUser));   // 
    setCheckingAuth(false);
return;
      }

    fetch(site_details.url + "customer/me", {
      credentials: "include",  // ✅ sends cookie
    })
      .then(async (res) => {
        if (res.ok) {
          // user is authenticated → redirect
          const data: UserInfo = await res.json();
          sessionStorage.setItem("userinfo", JSON.stringify(data));
          setUinfo(data);
          setCheckingAuth(false);
          
        } else {
          // not logged in → show login/register
          
          router.replace("/account/account");
        }
      })
      .catch(() => setCheckingAuth(false));
  }, [router]);

  if (checkingAuth) return <p className="p-8 text-center">{t('account.text_checking_auth')}..</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      Welcome {uinfo?.name}

      </div>
  );
}
