import { dynamoDB } from "../config/awsConfig";
import { CreditReport, UnderwritingDecision } from "../models/underwriting";

const TABLE_NAME = `Underwriting-${process.env.STAGE}`;

const UnderwritingKeys = {
  creditReportPk: (applicationId: string) => `APPLICATION#${applicationId}`,
  creditReportSk: (applicationId: string) => `CREDITREPORT#${applicationId}`,
  decisionPk: (applicationId: string) => `APPLICATION#${applicationId}`,
  decisionSk: (applicationId: string) => `DECISION#${applicationId}`,
};

export class UnderwritingRepository {
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
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();
  }

  async getCreditReport(applicationId: string): Promise<CreditReport> {
    const result = await dynamoDB
      .get({
        TableName: TABLE_NAME,
        Key: {
          PK: UnderwritingKeys.creditReportPk(applicationId),
          SK: UnderwritingKeys.creditReportSk(applicationId),
        },
      })
      .promise();

    if (!result.Item) {
      throw new Error(
        `Credit report not found for application: ${applicationId}`
      );
    }
    return result.Item as CreditReport;
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
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();
  }

  async getUnderwritingDecision(
    applicationId: string
  ): Promise<UnderwritingDecision> {
    const result = await dynamoDB
      .get({
        TableName: TABLE_NAME,
        Key: {
          PK: UnderwritingKeys.decisionPk(applicationId),
          SK: UnderwritingKeys.decisionSk(applicationId),
        },
      })
      .promise();

    if (!result.Item) {
      throw new Error(
        `Underwriting decision not found for application: ${applicationId}`
      );
    }
    return result.Item as UnderwritingDecision;
  }
}

export const underwritingRepository = new UnderwritingRepository();
