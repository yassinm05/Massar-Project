import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface types {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  password: string;
}

export default async function createUser({
  firstName,
  lastName,
  email,
  password,
  role,
  phoneNumber,
}: types) {
  try {
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
    };

    console.log("Sending user data:", userData);

    const response = await fetch("http://localhost:5236/api/Auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (
        response.status === 409 ||
        result.message?.includes("email already exists")
      ) {
        return {
          errors: {
            email:
              "It seems like an account for the chosen email already exists.",
          },
        };
      }
      return {
        errors: {
          email: `Server error: ${result.message || "Unknown error occurred"}`,
        },
      };
    }

    console.log("User created successfully:", result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        errors: {
          email:
            "Network error: Unable to connect to the server. Please check if the server is running.",
        },
      };
    }

    return {
      errors: {
        email: "An unexpected error occurred. Please try again.",
      },
    };
  }
}

export async function getUser(email: string, password: string) {
  try {
    const response = await fetch(`http://localhost:5236/api/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404 || response.status === 401) {
        return {
          errors: {
            email:
              "Could not authenticate user. Please check your credentials.",
          },
        };
      }
      return {
        errors: {
          email: `Server error: ${result.message || "Unknown error occurred"}`,
        },
      };
    }

    // Check if the result indicates success
    if (!result.success) {
      return {
        errors: {
          email: "Could not authenticate user. Please check your credentials.",
        },
      };
    }

    console.log("User fetched successfully:", result);
    return result;
  } catch (error: any) {
    console.error("Error fetching user by email:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        errors: {
          email:
            "Network error: Unable to connect to the server. Please check if the server is running.",
        },
      };
    }
    ``;

    return {
      errors: {
        email: "An unexpected error occurred. Please try again.",
      },
    };
  }
}

export async function getUserById(id: number) {
  try {
    const response = await fetch(`http://localhost:5236/api/Users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return {
          errors: {
            user: "User not found.",
          },
        };
      }
      return {
        errors: {
          user: `Server error: ${result.message || "Unknown error occurred"}`,
        },
      };
    }

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

export async function getCourseEnrollment() {
  try {
    const cookieStore = await cookies(); // wait for it
    const tokenCookie = cookieStore.get("auth-token");
    if (!tokenCookie?.value) {
      return redirect("/");
    }
    const response = await fetch(
      `http://localhost:5236/api/Enrollment/my-courses`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      }
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

export async function getCourseByID(id: number) {
  try {
    const response = await fetch(`http://localhost:5236/api/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
