import { DynamoDB } from "aws-sdk";
import { Business, BusinessKeys } from "../models/business";

const dynamodb = new DynamoDB.DocumentClient();

export class BusinessRepository {
  private tableName = "Businesses";

  async create(business: Business): Promise<void> {
    const item = {
      PK: BusinessKeys.pk(business.id),
      SK: BusinessKeys.sk(business.id),
      GSI1PK: BusinessKeys.gsi1pk(business.id),
      GSI1SK: BusinessKeys.gsi1sk(business.id),
      ...business,
    };

    await dynamodb
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async getById(businessId: string): Promise<Business | null> {
    const result = await dynamodb
      .get({
        TableName: this.tableName,
        Key: {
          PK: BusinessKeys.pk(businessId),
          SK: BusinessKeys.sk(businessId),
        },
      })
      .promise();

    return (result.Item as Business) || null;
  }
}

export const businessRepository = new BusinessRepository();
