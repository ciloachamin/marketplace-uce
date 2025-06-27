// src/utils/api.js
export async function authFetch(input, init = {}) {
  // Asegúrate de incluir siempre las cookies
  init.credentials = "include";
  init.headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };

  let res = await fetch(input, init);

  // Si el access-token expiró…
  if (res.status === 401) {
    // Intentamos refrescarlo
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    console.log("refreshRes", refreshRes);

    if (refreshRes.ok) {
      res = await fetch(input, init);
    }
  }

  return res;
}
