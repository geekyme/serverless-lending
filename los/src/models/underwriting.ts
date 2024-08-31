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

export const UnderwritingKeys = {
  creditReportPk: (applicationId: string) => `APPLICATION#${applicationId}`,
  creditReportSk: (applicationId: string) => `CREDITREPORT#${applicationId}`,
  decisionPk: (applicationId: string) => `APPLICATION#${applicationId}`,
  decisionSk: (applicationId: string) => `DECISION#${applicationId}`,
};
