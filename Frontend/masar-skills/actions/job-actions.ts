'use server'

import { cookies } from "next/headers";

export default async function getJobsAction(){
try {
 const cookieStore = await cookies();
   const tokenCookie = cookieStore.get("auth-token");
   
   if (!tokenCookie?.value) {
     throw new Error('Not authenticated');
   }
    const response = await fetch(`http://localhost:5236/api/jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${tokenCookie.value}`,
      },
    });

    const result = await response.json();

    // Check if the result indicates success
    if (!result) {
      return {
        errors: {
          user: "Failed to fetch available jobs",
        },
      };
    }
    console.log(result)
    return result;
  } catch (error: any) {
    console.error("Error fetching available jobs", error);

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

export async function getJobByIdAction(id:number){
  try {
 const cookieStore = await cookies();
   const tokenCookie = cookieStore.get("auth-token");
   
   if (!tokenCookie?.value) {
     throw new Error('Not authenticated');
   }
    const response = await fetch(`http://localhost:5236/api/jobs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${tokenCookie.value}`,
      },
    });

    const result = await response.json();

    // Check if the result indicates success
    if (!result) {
      return {
        errors: {
          user: "Failed to fetch the job",
        },
      };
    }
    console.log(result)
    return result;
  } catch (error: any) {
    console.error("Error fetching the job ", error);

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

export async function submitJobApplication({formData}) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie?.value) {
      throw new Error("Not authenticated");
    }
console.log(formData)
    // Create FormData for file + text fields
    const formDataToSend = new FormData();
    if (formData.ResumeFile) formDataToSend.append("ResumeFile", formData.ResumeFile);
    if (formData.CoverLetter) formDataToSend.append("CoverLetter", formData.CoverLetter);
    formDataToSend.append("PreferredShift", formData.PreferredShift || "");
    formDataToSend.append("NursingCompetencies", formData.NursingCompetencies || "");
    formDataToSend.append("PreviousWorkExperience", formData.PreviousWorkExperience || "");
    formDataToSend.append("LicenseCertificateNumber", formData.LicenseCertificateNumber || "");
    formDataToSend.append("JobId", formData.jobId || "");
    
console.log(` ${formDataToSend}`);
    const response = await fetch(`http://localhost:5236/api/jobApplications/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: formDataToSend, 
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Backend validation errors:", result.errors);
      throw new Error(result.title || "Failed to submit application");
    }

    return result;
  } catch (error) {
    console.error("Error submitting job application:", error);
    return {
      errors: {
        user: "An unexpected error occurred. Please try again.",
      },
    };
  }
}
