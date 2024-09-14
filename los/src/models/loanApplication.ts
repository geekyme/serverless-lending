import { Document } from "./document";

export interface LoanApplication {
  id: string;
  businessId: string;
  productId: string;
  status: string;
  submissionDate: string;
  requestedAmount: number;
  loanTerm: number;
  loanPurpose: string;
  // interestRate field removed
  collateralType?: string;
  collateralValue?: number;
  applicantEmail: string;
  documents?: Document[];
}
