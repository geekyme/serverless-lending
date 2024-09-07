import { LoanApplication } from "../types/Business";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const submitLoanApplication = async (
  applicationData: LoanApplication
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error submitting application:", error.message);
    } else {
      console.error("Unknown error submitting application");
    }
    throw error;
  }
};

export const uploadDocument = async ({
  applicationId,
  documentType,
  fileContent,
  fileName,
}: {
  applicationId: string;
  documentType: string;
  fileContent: string;
  fileName: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicationId,
      documentType,
      fileContent,
      fileName,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return response.json();
};
