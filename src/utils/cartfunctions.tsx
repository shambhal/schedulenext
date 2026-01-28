import { getUUID, site_details } from "@/config";
// api/cart.ts
export async function clearCartServer() {
  const endpoint = "cart/clear";
var body={ uuid: getUUID() }
  try {
    const response = await fetch(`${site_details.url}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body:JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to clear cart" };
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, data };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Network error" };
  }
}
