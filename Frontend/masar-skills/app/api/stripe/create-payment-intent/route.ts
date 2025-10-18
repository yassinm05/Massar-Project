import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { amount, paymentMethodId } = await req.json();

    if (!amount || !paymentMethodId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
      return_url: "http://localhost:3000/payment-success", // ✅ Required for 3D Secure
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    console.error("Stripe error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create payment intent";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
