'use server'
import { cookies } from "next/headers";

export default async function chatbotResponse(message:string,id:number){
try {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auth-token");

  if (!tokenCookie?.value) {
    throw new Error("Not authenticated");
  }
  const response = await fetch(`http://127.0.0.1:5000/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenCookie.value}`,
    },
    body: JSON.stringify({
      query: message,
      studentId: id,
    }),
  });

  const result = await response.json();

  // Check if the result indicates success
  if (!result) {
    return {
      errors: {
        user: "Failed to fetch chatbot response",
      },
    };
  }
  console.log(result);
  return result;
} catch (error: unknown) {
  console.error("Error fetching chatbot response", error);

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