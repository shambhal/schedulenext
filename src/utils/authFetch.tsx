export async function authFetch(url: string, options: RequestInit = {}) {
  const accessToken = sessionStorage.getItem("access_token");
  const refreshToken = sessionStorage.getItem("refresh_token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: { "Content-Type": "application/json" },
    });

    if (refreshRes.ok) {
      const { access_token } = await refreshRes.json();
      sessionStorage.setItem("access_token", access_token);
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${access_token}`,
        },
      });
    }
  }

  return res;
}
