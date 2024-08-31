import { Handler } from "aws-lambda";
import { underwritingRepository } from "../repositories/underwritingRepository";
import { CreditReport } from "../models/underwriting";

export const handler: Handler = async (event) => {
  try {
    const { applicationId } = event;

    // Simulate credit check with more realistic data
    const creditReport: CreditReport = {
      creditScore: Math.floor(Math.random() * 300) + 500, // Score between 500 and 800
      reportDate: new Date().toISOString(),
      delinquencies: Math.floor(Math.random() * 5), // 0 to 4 delinquencies
      bankruptcies: Math.floor(Math.random() * 2), // 0 or 1 bankruptcy
      creditUtilization: Math.random() * 100, // 0% to 100% credit utilization
      lengthOfCreditHistory: Math.floor(Math.random() * 240) + 12, // 1 to 21 years (in months)
    };

    await underwritingRepository.createCreditReport(
      applicationId,
      creditReport
    );

    return { applicationId, creditReport };
  } catch (error) {
    console.error("Error performing credit check:", error);
    throw error;
  }
};
