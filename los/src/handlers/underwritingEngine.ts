import { Handler } from "aws-lambda";
import { loanApplicationRepository } from "../repositories/loanApplicationRepository";
import { underwritingRepository } from "../repositories/underwritingRepository";
import { UnderwritingDecision, CreditReport } from "../models/underwriting";

export const handler: Handler = async (event) => {
  try {
    const { applicationId } = event;

    // Fetch loan application and credit report
    const application = await loanApplicationRepository.getById(applicationId);
    const creditReport: CreditReport =
      await underwritingRepository.getCreditReport(applicationId);

    // Simple underwriting logic (this should be much more comprehensive in a real system)
    let decision: UnderwritingDecision;
    if (creditReport.creditScore >= 700) {
      decision = {
        decision: "APPROVED",
        decisionDate: new Date().toISOString(),
        approvedAmount: application.requestedAmount,
        interestRate: 5.0,
        term: 60, // Assuming a 5-year term
        conditions: ["Proof of income", "Verification of employment"],
        reasonCodes: ["GOOD_CREDIT_SCORE", "SUFFICIENT_INCOME"],
        underwriterNotes:
          "Approved based on excellent credit score and sufficient income.",
      };
    } else {
      decision = {
        decision: "DENIED",
        decisionDate: new Date().toISOString(),
        reasonCodes: ["LOW_CREDIT_SCORE"],
        underwriterNotes: "Denied due to low credit score.",
      };
    }

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
