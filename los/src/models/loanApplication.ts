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
}

export const LoanApplicationKeys = {
  pk: (id: string) => `APPLICATION#${id}`,
  sk: (id: string) => `METADATA#${id}`,
  gsi1pk: (businessId: string) => `BUSINESS#${businessId}`,
  gsi1sk: (id: string) => `APPLICATION#${id}`,
};
