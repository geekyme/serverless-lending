export interface LoanApplication {
  id: string;
  businessId: string;
  status: "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "DENIED" | "FUNDED";
  submissionDate: string;
  requestedAmount: number;
  approvedAmount?: number;
  loanPurpose: string;
  loanTerm: number; // in months
  interestRate?: number;
  collateralType?: string;
  collateralValue?: number;
  creditScore?: number;
  debtServiceCoverageRatio?: number;
  lastReviewDate?: string;
  underwriterNotes?: string;
  applicantEmail: string;
}
