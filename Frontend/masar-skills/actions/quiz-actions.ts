"use server";
import { submitAnswer, finishQuiz } from "@/lib/quiz";
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

    // Check if the result indicates success
    if (!response) {
      return {
        errors: {
          user: "Failed to fetch user data.",
        },
      };
    }
    console.log("User fetched successfully:", response);
    return response;
  } catch (error: unknown) {
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
export async function handleFinishQuiz(attemptId: number) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      throw new Error("Not authenticated");
    }
    const response = await finishQuiz(attemptId, tokenCookie.value);

    // Check if the result indicates success
    if (!response) {
      return {
        errors: {
          user: "Failed to submit quiz.",
        },
      };
    }
    console.log("quiz submitted successfully:", response);
    return response;
  } catch (error: unknown) {
    console.error("Error submitting the quiz:", error);

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
