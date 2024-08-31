import { Handler } from "aws-lambda";
import { underwritingRepository } from "../repositories/underwritingRepository";
import { loanApplicationRepository } from "../repositories/loanApplicationRepository";
import { businessRepository } from "../repositories/businessRepository"; // Add this import
import { UnderwritingDecision } from "../models/underwriting";
import { calculateDebtServiceCoverageRatio } from "../utils/financialCalculations";

export const handler: Handler = async (event) => {
  try {
    const { applicationId } = event;

    const creditReport = await underwritingRepository.getCreditReport(
      applicationId
    );
    const loanApplication = await loanApplicationRepository.getById(
      applicationId
    );

    if (!creditReport || !loanApplication) {
      throw new Error("Credit report or loan application not found");
    }

    const business = await businessRepository.getById(
      loanApplication.businessId
    );

    if (!business) {
      throw new Error("Business not found");
    }

    const dscr = calculateDebtServiceCoverageRatio(
      business.financialStatements,
      loanApplication
    );

    // Implement more sophisticated underwriting logic here
    let decision: UnderwritingDecision["decision"] = "DENIED";
    let approvedAmount = 0;
    let interestRate = 0;
    const reasonCodes: string[] = [];

    if (creditReport.creditScore >= 700 && dscr >= 1.25) {
      decision = "APPROVED";
      approvedAmount = loanApplication.requestedAmount;
      interestRate = 5 + (800 - creditReport.creditScore) / 100; // Base rate of 5% plus adjustment for credit score
    } else if (creditReport.creditScore >= 650 && dscr >= 1.1) {
      decision = "APPROVED";
      approvedAmount = Math.min(
        loanApplication.requestedAmount,
        business.annualRevenue * 0.2
      );
      interestRate = 7 + (750 - creditReport.creditScore) / 50;
    } else {
      reasonCodes.push(
        creditReport.creditScore < 650
          ? "LOW_CREDIT_SCORE"
          : "INSUFFICIENT_CASH_FLOW"
      );
    }

    const underwritingDecision: UnderwritingDecision = {
      decision,
      decisionDate: new Date().toISOString(),
      approvedAmount,
      interestRate,
      term: loanApplication.loanTerm,
      reasonCodes,
    };

    await underwritingRepository.createUnderwritingDecision(
      applicationId,
      underwritingDecision
    );

    // Update application status
    await loanApplicationRepository.updateApplication(applicationId, {
      status: decision,
      approvedAmount,
      interestRate,
      debtServiceCoverageRatio: dscr,
      lastReviewDate: new Date().toISOString(),
    });

    return { applicationId, decision };
  } catch (error) {
    console.error("Error in underwriting engine:", error);
    throw error;
  }
};
