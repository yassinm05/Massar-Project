'use server'

import { cookies } from "next/headers";

interface PaymentData {
  courseId: number;
  amount: number;
  paymentMethod: string;
}

export default async function handlePaymentAction(
  courseId,
  amount,
  paymentMethod,
  paymentPlanType,
  paymentToken
) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      return {
        success: false,
        message: "Not authenticated. Please log in to continue.",
      };
    }

    const response = await fetch("http://localhost:5236/api/Payment/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenCookie.value}`,
      },
      body: JSON.stringify({
        courseId,
        amount,
        paymentMethod,
        paymentPlanType,
        paymentToken,
      }),
    });

    // ✅ Clone response to log without consuming the original body
    const cloned = response.clone();
    const rawText = await cloned.text();
    console.log("Raw backend response:", rawText);

    let result: any = null;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = rawText;
    }

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || `Payment failed (${response.status})`,
      };
    }

    return {
      success: true,
      message: result?.message || "Payment processed successfully!",
      data: result,
    };
  } catch (error: any) {
    console.error("Error processing payment:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        message:
          "Network error: Unable to connect to the server. Please ensure the backend is running.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getPaymentPlansAction(courseId:number){
 try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      return {
        success: false,
        message: "Not authenticated. Please log in to continue.",
      };
    }

    const response = await fetch(`http://localhost:5236/api/Payment/${courseId}/payment-plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenCookie.value}`,
      },
    });

    const contentType = response.headers.get("content-type");
    let result: any = null;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || `Payment failed (${response.status})`,
      };
    }
    console.log(result)
    return {
      success: true,
      message: result?.message || "Payment plans fetched successfully!",
      data: result,
    };

  } catch (error: any) {
    console.error("Error fetching the payment plans:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error: Unable to connect to the server. Please ensure the backend is running.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
export async function getPaymentDetailsAction(courseId:number){
 try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      return {
        success: false,
        message: "Not authenticated. Please log in to continue.",
      };
    }

    const response = await fetch(`http://localhost:5236/api/Payment/course/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenCookie.value}`,
      },
    });

    const contentType = response.headers.get("content-type");
    let result: any = null;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (!result) {
      return {
        success: false,
        message: result?.message || `failed getting the payment details`,
      };
    }
    console.log(result)
    return {
      success: true,
      message: result?.message || "Payment details fetched successfully!",
      data: result,
    };

  } catch (error: any) {
    console.error("Error fetching the payment details:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error: Unable to connect to the server. Please ensure the backend is running.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
