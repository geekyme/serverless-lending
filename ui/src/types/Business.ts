export interface Business {
  businessName: string;
  email: string;
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
  business: Business;
  requestedAmount: number;
  loanPurpose: string;
  loanTerm: number;
  collateralType: string;
  collateralValue: number;
  applicantEmail: string;
}
