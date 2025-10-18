import { NextRequest, NextResponse } from "next/server";

/**
 * @route GET /api/paypal/check-order-status/[orderId]
 * @desc Fetch PayPal order status by ID
 * @access Private (requires PAYPAL_ACCESS_TOKEN)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  // ✅ Await the promise-based params (Next.js 15+ typing)
  const { orderId } = await context.params;

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    // ✅ Ensure environment variable exists
    const accessToken = process.env.PAYPAL_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Missing PAYPAL_ACCESS_TOKEN in environment variables.");
      return NextResponse.json(
        { error: "PayPal access token not configured" },
        { status: 500 }
      );
    }

    // ✅ Fetch order status from PayPal API
    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // ✅ Handle PayPal API errors gracefully
    if (!response.ok) {
      const errorText = await response.text();
      console.error("PayPal API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch PayPal order details", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // ✅ Return PayPal order details to client
    return NextResponse.json({
      id: data.id,
      status: data.status,
      payer: data.payer,
      purchase_units: data.purchase_units,
      create_time: data.create_time,
      update_time: data.update_time,
    });
  } catch (error: unknown) {
    console.error("PayPal check-order-status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
