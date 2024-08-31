import { dynamoDB } from "../config/awsConfig";
import { CreditReport, UnderwritingDecision } from "../models/underwriting";

const UnderwritingKeys = {
  creditReportPk: (applicationId: string) => `APPLICATION#${applicationId}`,
  creditReportSk: (applicationId: string) => `CREDITREPORT#${applicationId}`,
  decisionPk: (applicationId: string) => `APPLICATION#${applicationId}`,
  decisionSk: (applicationId: string) => `DECISION#${applicationId}`,
};

export class UnderwritingRepository {
  private tableName = "Underwriting";

  async createCreditReport(
    applicationId: string,
    creditReport: CreditReport
  ): Promise<void> {
    const item = {
      PK: UnderwritingKeys.creditReportPk(applicationId),
      SK: UnderwritingKeys.creditReportSk(applicationId),
      ...creditReport,
    };

    await dynamoDB
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async getCreditReport(applicationId: string): Promise<CreditReport> {
    const result = await dynamoDB
      .get({
        TableName: this.tableName,
        Key: {
          PK: UnderwritingKeys.creditReportPk(applicationId),
          SK: UnderwritingKeys.creditReportSk(applicationId),
        },
      })
      .promise();

    return (result.Item as CreditReport) || null;
  }

  async createUnderwritingDecision(
    applicationId: string,
    decision: UnderwritingDecision
  ): Promise<void> {
    const item = {
      PK: UnderwritingKeys.decisionPk(applicationId),
      SK: UnderwritingKeys.decisionSk(applicationId),
      ...decision,
    };

    await dynamoDB
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async getUnderwritingDecision(
    applicationId: string
  ): Promise<UnderwritingDecision | null> {
    const result = await dynamoDB
      .get({
        TableName: this.tableName,
        Key: {
          PK: UnderwritingKeys.decisionPk(applicationId),
          SK: UnderwritingKeys.decisionSk(applicationId),
        },
      })
      .promise();

    return (result.Item as UnderwritingDecision) || null;
  }
}

export const underwritingRepository = new UnderwritingRepository();
