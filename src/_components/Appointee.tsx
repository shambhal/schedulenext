"use client";

import { useEffect, useState } from "react";
import GuestForm from "./GuestForm";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

import { site_details } from "@/config";

type CheckoutMode = "guest" | "register" | "login";

interface UserInfo {
  id: number;
  email: string;
  phone: string;
  name: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
}

interface AppointeeProps {
  onChange?: (user: UserInfo | null) => void;
  onOrderCreate?: (orderId: string) => void;
}

export default function Appointee({ onChange, onOrderCreate }: AppointeeProps) {
  const [mode, setMode] = useState<CheckoutMode>("guest");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from session or server
  useEffect(() => {
    const storedUser = sessionStorage.getItem("userinfo");
    const storedToken = sessionStorage.getItem("access_token");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({ ...user, token: storedToken || undefined });
      onChange?.(user);
      setLoading(false);
    } else {
      (async () => {
        try {
          const res = await fetch(`${site_details.url}user/info`, {
            credentials: "include",
            headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            sessionStorage.setItem("userinfo", JSON.stringify(data));
            setUserInfo(data);
            onChange?.(data);
          }
        } catch (err) {
          console.error("Failed to fetch user info", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userinfo") {
        const user = e.newValue ? JSON.parse(e.newValue) : null;
        setUserInfo(user);
        onChange?.(user);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleUserUpdate = async (user: UserInfo) => {
    setUserInfo(user);

    sessionStorage.setItem("userinfo", JSON.stringify(user));
    if (user.access_token) {
      sessionStorage.setItem("access_token", user.access_token);
      sessionStorage.setItem("refresh_token", user.refresh_token || "");
    }
    onChange?.(user);

    // Update order with appointee
    const order_id = sessionStorage.getItem("order_id") || "0";
    if (order_id !== "0") {
      try {
        console.log("updating order");
        console.log(user);
        const res = await fetch(`${site_details.url}orders/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(user.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}),
          },
          body: JSON.stringify({
            userId: user.id,
            order_id,
            appointee: user,
          }),
        });
        if (res.ok) {
          console.log("Appointee saved");
        }
      } catch (err) {
        console.error("Failed to update order", err);
      }
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    sessionStorage.removeItem("userinfo");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    onChange?.(null);
  };

  if (loading) return <p>Loading appointee details...</p>;

  return (
    <div className="space-y-4">
      {userInfo?.id ? (
        <div className="p-4 border rounded-lg bg-gray-50 shadow">
          <p className="font-semibold">Appointee:</p>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <p>Phone: {userInfo.phone}</p>
          <button
            onClick={handleLogout}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Log Out
          </button>
        </div>
      ) : (
        <>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                checked={mode === "guest"}
                onChange={() => setMode("guest")}
              />
              &nbsp; Guest Checkout
            </label>
            <label>
              <input
                type="radio"
                checked={mode === "register"}
                onChange={() => setMode("register")}
              />
              &nbsp; Register
            </label>
            <label>
              <input
                type="radio"
                checked={mode === "login"}
                onChange={() => setMode("login")}
              />
              &nbsp; Login
            </label>
          </div>

          {mode === "guest" && <GuestForm onSave={handleUserUpdate} />}
          {mode === "register" && <RegisterForm onSave={handleUserUpdate} />}
          {mode === "login" && <LoginForm onLogin={handleUserUpdate} />}
        </>
      )}
    </div>
  );
}
