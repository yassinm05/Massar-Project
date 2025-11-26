"use server";

import { hashUserPassword } from "@/lib/hash";
import createUser, { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { destroySession } from "@/lib/auth";

interface SignupErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  password?: string;
}

interface FormState {
  errors: SignupErrors;
}
const COOKIE_NAME = "auth-token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
const base_url = process.env.BACKEND_BASE_URL;

export async function signup(prevState: FormState, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  const errors: SignupErrors = {};

  // First Name validation
  if (!firstName || firstName.trim().length === 0) {
    errors.firstName = "First name is required";
  } else if (firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  } else if (firstName.trim().length > 50) {
    errors.firstName = "First name must be less than 50 characters";
  } else if (!/^[a-zA-Z\s'-]+$/.test(firstName.trim())) {
    errors.firstName =
      "First name can only contain letters, spaces, hyphens, and apostrophes";
  }

  // Last Name validation
  if (!lastName || lastName.trim().length === 0) {
    errors.lastName = "Last name is required";
  } else if (lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
  } else if (lastName.trim().length > 50) {
    errors.lastName = "Last name must be less than 50 characters";
  } else if (!/^[a-zA-Z\s'-]+$/.test(lastName.trim())) {
    errors.lastName =
      "Last name can only contain letters, spaces, hyphens, and apostrophes";
  }

  // Email validation
  if (!email || email.trim().length === 0) {
    errors.email = "Email address is required";
  } else if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  } else if (email.trim().length > 254) {
    errors.email = "Email address is too long";
  }

  // Role validation
  if (!role || role.trim().length === 0) {
    errors.role = "Role selection is required";
  }

  // Phone Number validation
  if (!phoneNumber || phoneNumber.trim().length === 0) {
    errors.phoneNumber = "Phone number is required";
  } else {
    // Remove all non-digit characters for validation
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      errors.phoneNumber = "Phone number must be at least 10 digits";
    } else if (cleanPhone.length > 15) {
      errors.phoneNumber = "Phone number must be less than 15 digits";
    } else if (!/^[\d\s\-\(\)\+\.]+$/.test(phoneNumber.trim())) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
  }

  // Password validation
  if (!password || password.length === 0) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (password.length > 128) {
    errors.password = "Password must be less than 128 characters";
  } else if (!/(?=.*[a-z])/.test(password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/(?=.*[A-Z])/.test(password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/(?=.*\d)/.test(password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    errors.password = "Password must contain at least one special character";
  }

  // Return validation errors if any
  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedPassword = hashUserPassword(password);

  try {
    // ✅ Await the createUser function
    const result = await createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role.toLowerCase(),
      phoneNumber: phoneNumber.trim(),
    });

    // ✅ Check if there were errors returned from the API
    if (result.errors) {
      return {
        errors: result.errors,
      };
    }

    // ✅ Only redirect if successful
    if (result.success) {
      redirect("/login");
    }

    // ✅ Fallback if result doesn't have success or errors
    return {
      errors: {
        email: "An unexpected error occurred. Please try again.",
      },
    };
  } catch (error: unknown) {
    // This catch block handles redirect throws and other unexpected errors
    console.error("Signup error:", error);

    // Check if it's a redirect error (Next.js throws errors for redirects)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // Re-throw redirect errors
    }

    // Handle other errors
    return {
      errors: {
        email: "An unexpected error occurred. Please try again.",
      },
    };
  }
}

export async function login(
  prevState: { errors: Record<string, string> },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = await getUser(email, password);
  console.log(existingUser);
  if (!existingUser) {
    return {
      errors: {
        email: "could not authenticate user. please check your credentials.",
      },
    };
  }
  if (existingUser.success && existingUser.token && existingUser.user) {
    const cookieStore = await cookies();
    await cookieStore.set(COOKIE_NAME, existingUser.token, COOKIE_OPTIONS);
    redirect("/dashboard");
  } else {
    return {
      errors: {
        email: "Authentication failed. Please try again.",
      },
    };
  }
}
export async function verifyAuthAction() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auth-token");

  if (!tokenCookie || !tokenCookie.value) {
    return {
      user: null,
      session: null,
    };
  }

  try {
    const response = await fetch(`${base_url}/api/auth/validate-token`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: tokenCookie.value,
      }),
    });

    const data = await response.json();
    console.log(response);

    if (!response.ok || !data.success || !data.user) {
      // Token is invalid, clear the cookie
      const cookieStore = await cookies();
      cookieStore.delete("auth-token");
      return {
        user: null,
        session: null,
      };
    }
    return {
      user: data.user,
      studentId: data.studentId,
      session: { token: tokenCookie.value },
    };
  } catch (error: unknown) {
    // Log the error and return null user/session
    console.error("Token validation error:", error);
    return {
      user: null,
      session: null,
    };
  }
}
export async function logout(currentPath?: string) {
  await destroySession();

  // Only redirect if not already on home page
  if (currentPath !== "/") {
    redirect("/");
  }
}
