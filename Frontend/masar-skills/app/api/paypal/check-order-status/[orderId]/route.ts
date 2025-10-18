import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// --- Constants ---
const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

// --- Types ---
interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalPayer {
  name?: {
    given_name?: string;
    surname?: string;
  };
  email_address?: string;
  payer_id?: string;
}

interface PayPalCapture {
  id: string;
  status: string;
  amount?: {
    currency_code: string;
    value: string;
  };
}

interface PayPalPurchaseUnit {
  reference_id?: string;
  amount?: {
    currency_code: string;
    value: string;
  };
  payments?: {
    captures?: PayPalCapture[];
  };
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  payer?: PayPalPayer;
  purchase_units?: PayPalPurchaseUnit[];
  create_time?: string;
  update_time?: string;
  [key: string]: unknown;
}

// --- Utility: Get Access Token ---
async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }

  const data: PayPalAccessTokenResponse = await response.json();
  return data.access_token;
}

// --- Route Handler ---
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> } // ✅ FIXED: Promise type
) {
  try {
    const { orderId: rawOrderId } = await context.params; // ✅ FIXED: await required
    let orderId = rawOrderId;

    const accessToken = await getAccessToken();

    console.log("Received parameter:", orderId);

    // Try to detect invalid orderId format
    if (!orderId || !/^\d/.test(orderId)) {
      console.log(
        "Parameter appears to be a token, checking for stored order ID..."
      );

      const cookieStore = await cookies();
      const storedOrder = cookieStore.get("paypal_order_id");
      const storedOrderId = storedOrder?.value;

      if (storedOrderId) {
        console.log("Found order ID in cookie:", storedOrderId);
        orderId = storedOrderId;
      } else {
        return NextResponse.json(
          {
            message:
              "Order ID not found. The token cannot be used directly to check order status.",
            help: "Ensure the order ID is stored when creating the order.",
            receivedParam: orderId,
          },
          { status: 400 }
        );
      }
    }

    console.log("Checking PayPal order status for ID:", orderId);

    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data: PayPalOrderResponse = await response.json();

    console.log("Check-order response:", JSON.stringify(data, null, 2));

    // Handle error response
    if (!response.ok) {
      const res = NextResponse.json(
        {
          message: "Failed to get PayPal order status",
          details: data,
        },
        { status: response.status }
      );

      if (response.status === 404) {
        res.cookies.delete("paypal_order_id");
      }

      return res;
    }

    // ✅ Successful response
    const responseData = {
      id: data.id,
      status: data.status,
      payer: data.payer,
      purchase_units: data.purchase_units,
      create_time: data.create_time,
      update_time: data.update_time,
    };

    const res = NextResponse.json(responseData);

    // Delete the cookie if completed or voided
    if (data.status === "COMPLETED" || data.status === "VOIDED") {
      res.cookies.delete("paypal_order_id");
    }

    return res;
  } catch (error) {
    console.error("Error checking PayPal order status:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
