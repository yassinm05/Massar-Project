"use server";

import { cookies } from "next/headers";

interface PaymentData {
  courseId: number;
  amount: number;
  paymentMethod: string;
  paymentPlanType: string;
  paymentToken: string;
}

// Define a reusable type for API responses
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Helper type for backend responses
interface BackendResponse {
  message?: string;
  [key: string]: unknown;
}

export default async function handlePaymentAction({
  courseId,
  amount,
  paymentMethod,
  paymentPlanType,
  paymentToken,
}: PaymentData): Promise<ApiResponse> {
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
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: JSON.stringify({
        courseId,
        amount,
        paymentMethod,
        paymentPlanType,
        paymentToken,
      }),
    });

    const cloned = response.clone();
    const rawText = await cloned.text();
    console.log("Raw backend response:", rawText);

    const contentType = response.headers.get("content-type");
    const result: BackendResponse | string =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : rawText;

    if (!response.ok) {
      const errorMessage =
        typeof result === "object" && result !== null && "message" in result
          ? (result as BackendResponse).message
          : undefined;

      return {
        success: false,
        message: errorMessage || `Payment failed (${response.status})`,
      };
    }

    const successMessage =
      typeof result === "object" && result !== null && "message" in result
        ? (result as BackendResponse).message
        : undefined;

    return {
      success: true,
      message: successMessage || "Payment processed successfully!",
      data: result,
    };
  } catch (error: unknown) {
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

export async function getPaymentPlansAction(
  courseId: number
): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      return {
        success: false,
        message: "Not authenticated. Please log in to continue.",
      };
    }

    const response = await fetch(
      `http://localhost:5236/api/Payment/${courseId}/payment-plans`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      }
    );

    const contentType = response.headers.get("content-type");
    const result: BackendResponse | string =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const errorMessage =
        typeof result === "object" && result !== null && "message" in result
          ? (result as BackendResponse).message
          : undefined;

      return {
        success: false,
        message: errorMessage || `Payment failed (${response.status})`,
      };
    }

    console.log(result);

    const successMessage =
      typeof result === "object" && result !== null && "message" in result
        ? (result as BackendResponse).message
        : undefined;

    return {
      success: true,
      message: successMessage || "Payment plans fetched successfully!",
      data: result,
    };
  } catch (error: unknown) {
    console.error("Error fetching the payment plans:", error);

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

export async function getPaymentDetailsAction(
  courseId: number
): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      return {
        success: false,
        message: "Not authenticated. Please log in to continue.",
      };
    }

    const response = await fetch(
      `http://localhost:5236/api/Payment/course/${courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      }
    );

    const contentType = response.headers.get("content-type");
    const result: BackendResponse | string =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!result) {
      return {
        success: false,
        message: "Failed getting the payment details",
      };
    }

    console.log(result);

    const successMessage =
      typeof result === "object" && result !== null && "message" in result
        ? (result as BackendResponse).message
        : undefined;

    return {
      success: true,
      message: successMessage || "Payment details fetched successfully!",
      data: result,
    };
  } catch (error: unknown) {
    console.error("Error fetching the payment details:", error);

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
