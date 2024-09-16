export interface Business {
  id: string;
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
  address: Address;
  contactInformation: ContactInformation;
  financialStatements: FinancialStatements;
  creditHistory?: CreditHistory;
  email: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ContactInformation {
  primaryContactName: string;
  phoneNumber: string;
  email: string;
}

export interface FinancialStatements {
  balanceSheet: BalanceSheet;
  incomeStatement: IncomeStatement;
  cashFlowStatement: CashFlowStatement;
}

export interface BalanceSheet {
  totalAssets: number;
  totalLiabilities: number;
  ownersEquity: number;
  currentAssets: number;
  currentLiabilities: number;
}

export interface IncomeStatement {
  revenue: number;
  expenses: number;
  netIncome: number;
}

export interface CashFlowStatement {
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
}

interface CreditHistory {
  bankruptcies: number;
  liens: number;
  judgments: number;
  defaultedLoans: number;
}
