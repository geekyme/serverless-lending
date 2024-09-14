import { LoanApplication } from "../types/Business";
import { LoanProduct } from "../types/LoanProduct";

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

export const getLoanProducts = async (): Promise<LoanProduct[]> => {
  const response = await fetch(`${API_BASE_URL}/loan-products`);
  if (!response.ok) {
    throw new Error("Failed to fetch loan products");
  }
  return response.json();
};

export const createLoanProduct = async (
  productData: Omit<LoanProduct, "productId">
): Promise<LoanProduct> => {
  const response = await fetch(`${API_BASE_URL}/loan-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error("Failed to create loan product");
  }
  return response.json();
};

export const updateLoanProduct = async (
  productId: string,
  productData: Partial<LoanProduct>
): Promise<LoanProduct> => {
  const response = await fetch(`${API_BASE_URL}/loan-products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error("Failed to update loan product");
  }
  return response.json();
};

export const deprecateLoanProduct = async (
  productId: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/loan-products/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to deprecate loan product");
  }
};
