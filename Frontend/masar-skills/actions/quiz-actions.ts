"use server";
import { submitAnswer } from "@/lib/quiz";
import { cookies } from "next/headers";

export async function submitAnswerAction(
  attemptId: number,
  questionId: number,
  selectedOption: number
) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      throw new Error("Not authenticated");
    }
    const response = await submitAnswer(
      attemptId,
      questionId,
      selectedOption,
      tokenCookie.value
    );

    const result = await response.json();

    // Check if the result indicates success
    if (!result) {
      return {
        errors: {
          user: "Failed to fetch user data.",
        },
      };
    }

    console.log("User fetched successfully:", result);
    return result;
  } catch (error: any) {
    console.error("Error fetching user by ID:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        errors: {
          user: "Network error: Unable to connect to the server. Please check if the server is running.",
        },
      };
    }

    return {
      errors: {
        user: "An unexpected error occurred. Please try again.",
      },
    };
  }
}
