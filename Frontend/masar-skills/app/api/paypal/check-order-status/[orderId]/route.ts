import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

async function getAccessToken() {
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

  const data = await response.json();
  return data.access_token;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }  // Changed from orderID to orderId
) {
  try {
    const accessToken = await getAccessToken();
    let { orderId } = params;  // Changed from orderID to orderId
    
    console.log("Received parameter:", orderId);
    
    // Check if this looks like a token (typically shorter) vs an order ID (typically starts with a number)
    // If it's a token, try to get the actual order ID from the cookie
    if (!orderId || !orderId.match(/^\d/)) {
      console.log("Parameter appears to be a token, checking for stored order ID");
      
      // Try to get the order ID from cookie
      const cookieStore = cookies();
      const storedOrderId = cookieStore.get('paypal_order_id')?.value;
      
      if (storedOrderId) {
        console.log("Found order ID in cookie:", storedOrderId);
        orderId = storedOrderId;
      } else {
        // If no cookie, we can't proceed
        return NextResponse.json(
          { 
            message: "Order ID not found. The payment token cannot be used directly to check order status.",
            help: "Please ensure the order ID is stored when creating the order.",
            receivedParam: orderId
          },
          { status: 400 }
        );
      }
    }
    
    console.log("Checking order status for ID:", orderId);
    
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    // Log to see actual PayPal response
    console.log("Check-order response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      // If it's a not found error and we tried with a cookie value, clear the cookie
      if (response.status === 404) {
        const res = NextResponse.json(
          { 
            message: "PayPal order not found", 
            details: data,
            orderId: orderId 
          },
          { status: response.status }
        );
        
        // Clear the invalid cookie
        res.cookies.delete('paypal_order_id');
        return res;
      }
      
      return NextResponse.json(
        { message: "Failed to get PayPal order status", details: data },
        { status: response.status }
      );
    }

    // Successfully got order details
    const responseData = {
      id: data.id,
      status: data.status,
      payer: data.payer,
      purchase_units: data.purchase_units,
      create_time: data.create_time,
      update_time: data.update_time,
    };

    // Clear the cookie after successful retrieval (optional)
    const res = NextResponse.json(responseData);
    
    // Only clear cookie if the order is completed or cancelled
    if (data.status === 'COMPLETED' || data.status === 'VOIDED') {
      res.cookies.delete('paypal_order_id');
    }
    
    return res;
  } catch (error: any) {
    console.error("Error checking PayPal order status:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}