export interface CreditReport {
  creditScore: number;
  reportDate: string;
  delinquencies: number;
  bankruptcies: number;
  creditUtilization: number;
  lengthOfCreditHistory: number;
}

export interface UnderwritingDecision {
  decision: "APPROVED" | "DENIED" | "NEED_MORE_INFO";
  decisionDate: string;
  approvedAmount?: number;
  interestRate?: number;
  term?: number;
  conditions?: string[];
  reasonCodes?: string[];
  underwriterNotes?: string;
}
