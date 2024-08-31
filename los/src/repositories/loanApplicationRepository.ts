import { DynamoDB } from "aws-sdk";
import {
  LoanApplication,
  LoanApplicationKeys,
} from "../models/loanApplication";
import { Document, DocumentKeys } from "../models/document";

const dynamodb = new DynamoDB.DocumentClient();

export class LoanApplicationRepository {
  private tableName = "LoanApplications";

  async create(application: LoanApplication): Promise<void> {
    const item = {
      PK: LoanApplicationKeys.pk(application.id),
      SK: LoanApplicationKeys.sk(application.id),
      GSI1PK: LoanApplicationKeys.gsi1pk(application.businessId),
      GSI1SK: LoanApplicationKeys.gsi1sk(application.id),
      ...application,
    };

    await dynamodb
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async getById(applicationId: string): Promise<LoanApplication | null> {
    const result = await dynamodb
      .get({
        TableName: this.tableName,
        Key: {
          PK: LoanApplicationKeys.pk(applicationId),
          SK: LoanApplicationKeys.sk(applicationId),
        },
      })
      .promise();

    return (result.Item as LoanApplication) || null;
  }

  async updateApplication(
    applicationId: string,
    updates: Partial<LoanApplication>
  ): Promise<void> {
    const updateExpression =
      "set " +
      Object.keys(updates)
        .map((key) => `#${key} = :${key}`)
        .join(", ");
    const expressionAttributeNames = Object.keys(updates).reduce(
      (acc, key) => ({ ...acc, [`#${key}`]: key }),
      {}
    );
    const expressionAttributeValues = Object.entries(updates).reduce(
      (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
      {}
    );

    await dynamodb
      .update({
        TableName: this.tableName,
        Key: {
          PK: LoanApplicationKeys.pk(applicationId),
          SK: LoanApplicationKeys.sk(applicationId),
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise();
  }

  async addDocument(document: Document): Promise<void> {
    const item = {
      PK: DocumentKeys.pk(document.applicationId),
      SK: DocumentKeys.sk(document.id),
      ...document,
    };

    await dynamodb
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }
}

export const loanApplicationRepository = new LoanApplicationRepository();
