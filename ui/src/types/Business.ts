export interface Business {
  id: string;
  businessName: string;
  legalName: string;
  tradingName?: string;
  businessStructure:
    | "SOLE_PROPRIETORSHIP"
    | "PARTNERSHIP"
    | "LLC"
    | "CORPORATION";
  taxId: string;
  dateEstablished: string;
  numberOfEmployees: number;
  annualRevenue: number;
  industryCode: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactInformation: {
    primaryContactName: string;
    phoneNumber: string;
    email: string;
  };
  financialStatements: {
    balanceSheet: {
      totalAssets: number;
      totalLiabilities: number;
      ownersEquity: number;
      currentAssets: number;
      currentLiabilities: number;
    };
    incomeStatement: {
      revenue: number;
      expenses: number;
      netIncome: number;
    };
    cashFlowStatement: {
      operatingCashFlow: number;
      investingCashFlow: number;
      financingCashFlow: number;
    };
  };
  creditHistory?: {
    bankruptcies: number;
    liens: number;
    judgments: number;
    defaultedLoans: number;
  };
}

export interface LoanDetails {
  requestedAmount: number;
  loanPurpose: string;
  loanTerm: number;
  collateralType: string;
  collateralValue: number;
}

export interface LoanApplication {
  businessId: string; // Add this line
  productId: string; // Add this line
  business: Business;
  requestedAmount: number;
  loanPurpose: string;
  loanTerm: number;
  collateralType: string;
  collateralValue: number;
  applicantEmail: string;
}
