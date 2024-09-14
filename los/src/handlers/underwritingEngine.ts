import { Handler } from "aws-lambda";
import { loanApplicationRepository } from "../repositories/loanApplicationRepository";
import { loanProductRepository } from "../repositories/loanProductRepository";
import { underwritingRepository } from "../repositories/underwritingRepository";
import { UnderwritingDecision, CreditReport } from "../models/underwriting";
import { LoanProduct } from "../models/loanProduct";
import { LoanApplication } from "../models/loanApplication";

export const handler: Handler = async (event) => {
  try {
    const { applicationId } = event;

    // Fetch loan application, product, and credit report
    const application = await loanApplicationRepository.getById(applicationId);
    const product = await loanProductRepository.getById(
      application.productId,
      1
    );
    const creditReport = await underwritingRepository.getCreditReport(
      applicationId
    );

    // Enhanced underwriting logic considering product details
    const decision = makeUnderwritingDecision(
      application,
      product,
      creditReport
    );

    const decisionWithId = {
      applicationId,
      applicantEmail: application.applicantEmail,
      ...decision,
    };

    await underwritingRepository.createUnderwritingDecision(
      applicationId,
      decision
    );

    return decisionWithId;
  } catch (error) {
    console.error("Error in underwriting engine:", error);
    throw error;
  }
};

function makeUnderwritingDecision(
  application: LoanApplication,
  product: LoanProduct,
  creditReport: CreditReport
): UnderwritingDecision {
  const minCreditScore = product.eligibilityCriteria.minCreditScore;

  if (creditReport.creditScore >= minCreditScore) {
    const approvedAmount = Math.min(
      application.requestedAmount,
      product.maxLoanAmount
    );
    const interestRate =
      product.baseInterestRate + (800 - creditReport.creditScore) * 0.01;

    return {
      decision: "APPROVED",
      decisionDate: new Date().toISOString(),
      approvedAmount,
      interestRate,
      term: application.loanTerm,
      conditions: product.eligibilityCriteria?.conditions ?? [],
      reasonCodes: ["MEETS_CREDIT_REQUIREMENTS", "WITHIN_PRODUCT_LIMITS"],
      underwriterNotes: `Approved based on credit score and product eligibility. Interest rate: ${interestRate.toFixed(
        2
      )}%`,
    };
  } else {
    return {
      decision: "DENIED",
      decisionDate: new Date().toISOString(),
      reasonCodes: ["BELOW_MIN_CREDIT_SCORE"],
      underwriterNotes:
        "Denied due to credit score below product minimum requirement.",
    };
  }
}
