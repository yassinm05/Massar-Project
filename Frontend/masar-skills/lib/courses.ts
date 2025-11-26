import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const base_url = process.env.BACKEND_BASE_URL;
export async function getCourses() {
  try {
    const cookieStore = await cookies(); // wait for it
    const tokenCookie = cookieStore.get("auth-token");
    if (!tokenCookie?.value) {
      return redirect("/");
    }
    const response = await fetch(`${base_url}/api/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    });
    const result = await response.json();

    // Check if the result indicates success
    if (!result) {
      return {
        errors: {
          user: "Failed to fetch courses data.",
        },
      };
    }

    console.log("courses fetched successfully:", result);
    return result;
  } catch (error: unknown) {
    console.error("Error fetching courses:", error);

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