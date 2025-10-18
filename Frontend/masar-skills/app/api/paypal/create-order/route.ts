// app/api/paypal/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Get PayPal Access Token
async function getPayPalAccessToken() {
  console.log("=== Getting PayPal Access Token ===");
  console.log("Client ID exists:", !!PAYPAL_CLIENT_ID);
  console.log("Client Secret exists:", !!PAYPAL_CLIENT_SECRET);
  console.log("PayPal API URL:", PAYPAL_API);

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error(
      "PayPal credentials not configured. Check your .env.local file."
    );
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    console.log("Auth response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PayPal auth failed:", errorText);
      throw new Error(
        `PayPal authentication failed: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.access_token) {
      console.error("No access token in response:", data);
      throw new Error("No access token received from PayPal");
    }

    console.log("Access token obtained successfully");
    return data.access_token;
  } catch (error: any) {
    console.error("Error in getPayPalAccessToken:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  console.log("\n=== PayPal Create Order API Called ===");

  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { courseId, amount, paymentPlanType } = body;

    // Validate inputs
    if (!courseId || !amount || !paymentPlanType) {
      console.error("Validation failed:", {
        courseId,
        amount,
        paymentPlanType,
      });
      return NextResponse.json(
        {
          message: "Missing required fields",
          received: { courseId, amount, paymentPlanType },
        },
        { status: 400 }
      );
    }

    // Validate amount is a valid number
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error("Invalid amount:", amount);
      return NextResponse.json(
        { message: "Amount must be a positive number", received: amount },
        { status: 400 }
      );
    }

    // Ensure amount has max 2 decimal places
    const formattedAmount = numericAmount.toFixed(2);

    console.log("Creating PayPal order for:", {
      courseId,
      amount: formattedAmount,
      paymentPlanType,
    });

    // Get access token
    const accessToken = await getPayPalAccessToken();
    console.log("Access token length:", accessToken.length);

    // Get the base URL from the request
    const { origin } = new URL(request.url);

    // Create order payload - TEMPORARY without custom return URLs
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: formattedAmount,
          },
          description: `Course Payment - ID: ${courseId}`,
          custom_id: `${courseId}_${paymentPlanType}`,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "Your Course Platform",
      },
    };

    console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    console.log("Order creation response status:", orderResponse.status);
    console.log(
      "Response content-type:",
      orderResponse.headers.get("content-type")
    );

    // Check if response is JSON
    const contentType = orderResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await orderResponse.text();
      console.error("Non-JSON response from PayPal:", text);
      return NextResponse.json(
        {
          message: "PayPal returned an invalid response (not JSON)",
          details: text.substring(0, 200),
        },
        { status: 500 }
      );
    }

    const orderData = await orderResponse.json();
    console.log("Order data received:", JSON.stringify(orderData, null, 2));

    if (!orderResponse.ok) {
      console.error("PayPal order creation failed:", orderData);
      console.error("Full error details:", JSON.stringify(orderData, null, 2));

      // Extract detailed error message
      let errorMessage = orderData.message || "Failed to create PayPal order";
      if (orderData.details && Array.isArray(orderData.details)) {
        const detailMessages = orderData.details
          .map((d: any) => `${d.issue}: ${d.description}`)
          .join(", ");
        errorMessage += ` - ${detailMessages}`;
      }

      return NextResponse.json(
        {
          message: errorMessage,
          details: orderData.details || orderData,
          debug: {
            amount: parseFloat(amount).toFixed(2),
            courseId,
            paymentPlanType,
          },
        },
        { status: orderResponse.status }
      );
    }

    // Extract the approval URL
    const approvalUrl = orderData.links?.find(
      (link: any) => link.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      console.error("No approval URL found in PayPal response");
      console.error("Links received:", orderData.links);
      return NextResponse.json(
        {
          message: "PayPal order created but no approval URL found",
          orderID: orderData.id,
          links: orderData.links,
        },
        { status: 500 }
      );
    }

    // Add the order ID to the approval URL as a custom parameter
    // This way we can retrieve it when PayPal redirects back
    const urlObj = new URL(approvalUrl);
    urlObj.searchParams.append('order_id', orderData.id);
    const modifiedApprovalUrl = urlObj.toString();

    // Update the return URLs in PayPal's system by patching the order
    try {
      const patchResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderData.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            op: "replace",
            path: "/application_context/return_url",
            value: `${origin}/paypal/return?order_id=${orderData.id}`,
          },
          {
            op: "replace",
            path: "/application_context/cancel_url",
            value: `${origin}/paypal/cancel?order_id=${orderData.id}`,
          },
        ]),
      });

      if (!patchResponse.ok) {
        console.warn("Failed to update return URLs, but order was created");
      }
    } catch (patchError) {
      console.warn("Failed to patch return URLs:", patchError);
      // Continue anyway - the order was created successfully
    }

    console.log("✅ PayPal order created successfully:", orderData.id);
    console.log("✅ Approval URL:", approvalUrl);

    // Store the order ID in a cookie or session for retrieval later
    // This is a fallback if the URL parameter method doesn't work
    const response = NextResponse.json({
      orderID: orderData.id,
      approvalUrl: approvalUrl, // Use original URL, as PayPal might strip custom params
      links: orderData.links,
    });

    // Set a secure httpOnly cookie with the order ID
    response.cookies.set({
      name: 'paypal_order_id',
      value: orderData.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error("❌ Error creating PayPal order:", error);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        message: error.message || "Internal server error",
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}