import { Handler } from "aws-lambda";
import { underwritingRepository } from "../repositories/underwritingRepository";
import { CreditReport } from "../models/underwriting";

export const handler: Handler = async (event) => {
  try {
    const { applicationId } = event;

    // Simulate credit check
    const creditReport: CreditReport = {
      creditScore: Math.floor(Math.random() * (850 - 300 + 1)) + 300,
      reportDate: new Date().toISOString(),
      delinquencies: Math.floor(Math.random() * 5),
      bankruptcies: Math.floor(Math.random() * 2),
      creditUtilization: Math.random() * 100,
      lengthOfCreditHistory: Math.floor(Math.random() * 240) + 12, // 1-20 years in months
    };

    await underwritingRepository.createCreditReport(
      applicationId,
      creditReport
    );

    return { applicationId, creditScore: creditReport.creditScore };
  } catch (error) {
    console.error("Error performing credit check:", error);
    throw error;
  }
};
