// app/api/paypal/capture-order/[orderId]/route.ts
import { NextResponse } from "next/server";

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

// ✅ Utility: Get PayPal Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("PayPal auth failed:", text);
    throw new Error("Failed to get PayPal access token");
  }

  const data = await res.json();
  if (!data.access_token) throw new Error("No access token returned from PayPal");
  return data.access_token;
}

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params;
  console.log(`\n=== Capturing PayPal Order: ${orderId} ===`);

  try {
    const accessToken = await getAccessToken();

    // 🔹 Attempt to capture payment
    const captureRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await captureRes.json();
    console.log("PayPal capture response:", JSON.stringify(data, null, 2));

    // 🔸 CASE 1: Order already captured
    if (
      data.name === "UNPROCESSABLE_ENTITY" &&
      data.details?.some((d: any) => d.issue === "ORDER_ALREADY_CAPTURED")
    ) {
      console.warn(`Order ${orderId} was already captured.`);

      // Fetch existing order details to confirm its capture info
      const detailsRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const details = await detailsRes.json();
      const captureId =
        details?.purchase_units?.[0]?.payments?.captures?.[0]?.id || "unknown";
      const payerEmail = details?.payer?.email_address || "unknown";

      return NextResponse.json(
        {
          success: true,
          message: "Order was already captured earlier.",
          orderId,
          captureId,
          payerEmail,
          details,
        },
        { status: 200 }
      );
    }

    // 🔸 CASE 2: Capture failed
    if (!captureRes.ok) {
      console.error("❌ PayPal capture failed:", data);

      const errorMessage =
        data.message ||
        data.details?.map((d: any) => `${d.issue}: ${d.description}`).join(", ") ||
        "Failed to capture PayPal order";

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          orderId,
          details: data.details || data,
        },
        { status: captureRes.status }
      );
    }

    // 🔸 CASE 3: Capture succeeded
    const captureId =
      data?.purchase_units?.[0]?.payments?.captures?.[0]?.id || "unknown";
    const payerEmail = data?.payer?.email_address || "unknown";

    console.log(`✅ Payment captured successfully for Order ${orderId}`);
    console.log("Capture ID:", captureId);

    return NextResponse.json(
      {
        success: true,
        message: "Payment captured successfully",
        orderId,
        captureId,
        payerEmail,
        details: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("💥 Error in PayPal capture route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
