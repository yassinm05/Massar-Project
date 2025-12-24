'use server'
import { cookies } from "next/headers";
export async function chatbotResponse(message: string, id: number) {
  try {
    const base_url = process.env.CHATBOT_BASE_URL;
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${base_url}/api/chat`, {
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
    console.log(result);

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

export async function transcriptVoice(formData: FormData) {
  try {
    const base_url = process.env.CHATBOT_BASE_URL;
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      throw new Error("Not authenticated");
    }

    // ✅ Parse studentId to number and create new FormData
    const studentIdString = formData.get("studentId");
    const studentId = studentIdString
      ? parseInt(studentIdString as string, 10)
      : null;

    // Create new FormData with parsed studentId
    const newFormData = new FormData();
    newFormData.append("audio", formData.get("audio") as Blob);
    if (studentId !== null) {
      newFormData.append("studentId", studentId.toString()); // Still needs to be string in FormData
    }

    const response = await fetch(`${base_url}/api/transcribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: newFormData,
    });

    const result = await response.json();

    // Check if the result indicates success
    if (!result) {
      return {
        errors: {
          user: "Failed to transcribe voice",
        },
      };
    }

    console.log(result);
    return result;
  } catch (error: unknown) {
    console.error("Error transcribing voice", error);

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