import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { loanApplicationRepository } from "../repositories/loanApplicationRepository";
import { businessRepository } from "../repositories/businessRepository";
import { loanProductRepository } from "../repositories/loanProductRepository";
import { LoanApplication } from "../models/loanApplication";
import { Business } from "../models/business";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const applicationData = JSON.parse(event.body || "{}");
    const applicationId = uuidv4();
    const businessId = applicationData.businessId || uuidv4();

    if (!applicationData.productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Product ID is required" }),
      };
    }

    // Validate that the product exists
    try {
      const product = await loanProductRepository.getById(
        applicationData.productId,
        1
      );

      console.log("Product:", product);

      // Validate that the requested amount is within the product's range
      if (
        applicationData.requestedAmount < product.minLoanAmount ||
        applicationData.requestedAmount > product.maxLoanAmount
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message:
              "Requested amount is outside the allowed range for this product",
          }),
        };
      }

      // Validate that the loan term is one of the allowed options
      if (!product.termOptions.includes(applicationData.loanTerm)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Invalid loan term for this product",
          }),
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid loan product selected" }),
      };
    }

    const business: Business = {
      id: businessId,
      ...applicationData.business,
    };

    await businessRepository.create(business);

    const loanApplication: LoanApplication = {
      id: applicationId,
      businessId: businessId,
      productId: applicationData.productId,
      status: "SUBMITTED",
      submissionDate: new Date().toISOString(),
      requestedAmount: applicationData.requestedAmount,
      loanPurpose: applicationData.loanPurpose,
      loanTerm: applicationData.loanTerm,
      collateralType: applicationData.collateralType,
      collateralValue: applicationData.collateralValue,
      applicantEmail: applicationData.applicantEmail,
    };

    await loanApplicationRepository.create(loanApplication);

    return {
      statusCode: 201,
      body: JSON.stringify({ applicationId, businessId }),
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error submitting application" }),
    };
  }
};
