export default async function chatbotResponse(message:string){
try {
 
    const response = await fetch(`http://localhost:5236/api/chatbot/chatbot-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
            message:message,
        })
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

    return result;
  } catch (error: any) {
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