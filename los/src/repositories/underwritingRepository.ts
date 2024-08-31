import { DynamoDB } from "aws-sdk";
import {
  CreditReport,
  UnderwritingDecision,
  UnderwritingKeys,
} from "../models/underwriting";

const dynamodb = new DynamoDB.DocumentClient();

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

    await dynamodb
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async getCreditReport(applicationId: string): Promise<CreditReport | null> {
    const result = await dynamodb
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

    await dynamodb
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async getUnderwritingDecision(
    applicationId: string
  ): Promise<UnderwritingDecision | null> {
    const result = await dynamodb
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
