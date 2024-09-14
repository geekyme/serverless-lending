import { Document } from "./document";

export interface LoanApplication {
  id: string;
  businessId: string;
  productId: string; // Add this line
  status: string;
  submissionDate: string;
  requestedAmount: number;
  loanPurpose: string;
  loanTerm: number;
  collateralType?: string;
  collateralValue?: number;
  applicantEmail: string;
  documents?: Document[];
}
