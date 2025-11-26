export async function submitAnswer(
  attemptId: number,
  questionId: number,
  selectedOption: number,
  token: string
) {
  const base_url = process.env.BACKEND_BASE_URL;
  try {
    const response = await fetch(`${base_url}/api/Quiz/submit-answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attemptId: attemptId,
        questionId: questionId,
        selectedOptionId: selectedOption,
      }),
    });

    const result = await response.json();

    // Check if the result indicates success
    if (!response.ok) {
      return {
        errors: {
          user: "Failed to fetch user data.",
        },
      };
    }

    console.log("User fetched successfully:", result);
    return result;
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

export async function getQuizByID(id: number, token: string) {
  const base_url = process.env.BACKEND_BASE_URL;
  try {
    const response = await fetch(`${base_url}/api/quiz/start/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
export async function getAvailableQuizzes(token: string) {
  const base_url = process.env.BACKEND_BASE_URL;
  try {
    const response = await fetch(`${base_url}/api/Quiz/available`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export async function getResult(id: number, token: string) {
  const base_url = process.env.BACKEND_BASE_URL;
  try {
    const response = await fetch(`${base_url}/api/Quiz/results/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    // Check if the result indicates success
    if (!result) {
      return {
        errors: {
          user: "Failed to fetch result data.",
        },
      };
    }

    console.log("result fetched successfully:", result);
    return result;
  } catch (error: unknown) {
    console.error("Error fetching result by ID:", error);

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
