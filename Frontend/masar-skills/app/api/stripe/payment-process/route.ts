import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    console.log("📤 Proxying payment request:", body);

    const backendUrl = process.env.BACKEND_BASE_URL;

    if (!backendUrl) {
      throw new Error("BACKEND_BASE_URL is not configured");
    }

    const response = await fetch(`${backendUrl}/api/Payment/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`, // ✅ Add auth token
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log("📥 Backend response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Payment processing failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}