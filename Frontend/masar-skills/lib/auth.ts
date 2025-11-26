import { cookies } from "next/headers";
export async function verifyAuth() {
  const base_url = process.env.BACKEND_BASE_URL;
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auth-token");

  if (!tokenCookie || !tokenCookie.value) {
    return {
      user: null,
      session: null,
    };
  }

  try {
    const response = await fetch(`${base_url}/api/auth/validate-token`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: tokenCookie.value,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.user) {
      // Token is invalid, clear the cookie
      const cookieStore = await cookies();
      cookieStore.delete("auth-token");
      return {
        user: null,
        session: null,
      };
    }

    return {
      user: data.user,
      session: { token: tokenCookie.value },
    };
  } catch {
    // If an error occurs (network or parsing), treat as no session
    return {
      user: null,
      session: null,
    };
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auth-token");

  if (!tokenCookie) {
    return {
      error: "No active session found",
    };
  }

  cookieStore.delete("auth-token");

  return {
    success: true,
  };
}
