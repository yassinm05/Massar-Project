"use server";

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import createUser, { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedPassword = hashUserPassword(password);

  try {
    createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role.toLowerCase(),
      phoneNumber: phoneNumber.trim(),
    });
    redirect("/login");
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email:
            "It seems like an account for the chosen email already exists.",
        },
      };
    }
  }
}
export async function login(prevState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = await getUser(email, password);

  if (!existingUser) {
    return {
      errors: {
        email: "could not authenticate user. please check your credentials.",
      },
    };
  }
  if (existingUser.success && existingUser.token && existingUser.user) {
    await cookies().set(COOKIE_NAME, existingUser.token, COOKIE_OPTIONS);
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
  const cookieStore = await cookies(); // wait for it
  const tokenCookie = cookieStore.get("auth-token");

  if (!tokenCookie || !tokenCookie.value) {
    return {
      user: null,
      session: null,
    };
  }

  try {
    const response = await fetch(
      "http://localhost:5236/api/auth/validate-token",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenCookie.value,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success || !data.user) {
      // Token is invalid, clear the cookie
      const cookieStore = await cookies(); // wait for it
      cookieStore.delete("auth-token");
      return {
        user: null,
        session: null,
      };
    }

    return {
      user: data.user,
      session: { token: tokenCookie.value },
    };
  } catch (error) {
    return {
      user: null,
      session: null,
    };
  }
}
