import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { loanApplicationRepository } from "../repositories/loanApplicationRepository";
import { businessRepository } from "../repositories/businessRepository";
import { LoanApplication } from "../models/loanApplication";
import { Business } from "../models/business";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const applicationData = JSON.parse(event.body || "{}");
    const applicationId = uuidv4();
    const businessId = applicationData.businessId || uuidv4();

    const business: Business = {
      id: businessId,
      ...applicationData.business,
    };

    await businessRepository.create(business);

    const loanApplication: LoanApplication = {
      id: applicationId,
      businessId: businessId,
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
