export interface LoanProduct {
  productId: string;
  versionNumber: number;
  productName: string;
  productType: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRateType: "Fixed" | "Variable";
  baseInterestRate: number;
  termOptions: number[];
  eligibilityCriteria: {
    minCreditScore: number;
    conditions?: string[];
  };
  fees?: Record<string, any>;
  collateralRequirements?: string;
  underwritingGuidelines?: string;
  status: "Active" | "Inactive" | "Deprecated";
  createdAt: string;
  updatedAt: string;
}
