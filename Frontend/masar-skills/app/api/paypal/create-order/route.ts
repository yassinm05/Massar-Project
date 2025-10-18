// app/api/paypal/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

interface PayPalErrorDetail {
  issue?: string;
  description?: string;
}
interface PayPalLink {
  href: string;
  rel: string;
  method?: string;
}

// --- Helper: Get PayPal Access Token ---
async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials missing in environment.");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `PayPal authentication failed: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  if (!data.access_token)
    throw new Error("No access token received from PayPal");

  return data.access_token;
}

// --- Route Handler ---
export async function POST(request: NextRequest) {
  console.log("\n=== PayPal Create Order API Called ===");

  try {
    const body = await request.json();
    const { courseId, amount, paymentPlanType } = body;

    if (!courseId || !amount || !paymentPlanType) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          received: { courseId, amount, paymentPlanType },
        },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number", received: amount },
        { status: 400 }
      );
    }

    const formattedAmount = numericAmount.toFixed(2);
    const accessToken = await getPayPalAccessToken();
    const { origin } = new URL(request.url);

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: formattedAmount },
          description: `Course Payment - ID: ${courseId}`,
          custom_id: `${courseId}_${paymentPlanType}`,
        },
      ],
      application_context: {
        brand_name: "Your Course Platform",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: `${origin}/paypal/return?order_id={order_id}`,
        cancel_url: `${origin}/paypal/cancel?order_id={order_id}`,
      },
    };

    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const contentType = orderResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await orderResponse.text();
      return NextResponse.json(
        {
          message: "PayPal returned invalid response (not JSON)",
          details: text.slice(0, 200),
        },
        { status: 500 }
      );
    }

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      const details =
        (orderData.details as PayPalErrorDetail[] | undefined)
          ?.map((d) => `${d.issue}: ${d.description}`)
          .join(", ") || "";
      const message = `${
        orderData.message || "Failed to create PayPal order"
      } ${details}`;
      return NextResponse.json(
        { message, details: orderData },
        { status: orderResponse.status }
      );
    }

    const approvalUrl = (orderData.links as PayPalLink[] | undefined)?.find(
      (link) => link.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      return NextResponse.json(
        {
          message: "PayPal order created but no approval URL found",
          orderID: orderData.id,
        },
        { status: 500 }
      );
    }
    const response = NextResponse.json({
      orderID: orderData.id,
      approvalUrl,
      links: orderData.links,
    });

    response.cookies.set({
      name: "paypal_order_id",
      value: orderData.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    console.log(`✅ PayPal order created successfully: ${orderData.id}`);
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("❌ Error creating PayPal order:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
