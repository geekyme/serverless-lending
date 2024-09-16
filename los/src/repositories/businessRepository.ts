import { dynamoDB } from "../config/awsConfig";
import { Business } from "../models/business";

const TABLE_NAME = `Businesses-${process.env.STAGE}`;

export const BusinessKeys = {
  pk: (id: string) => `BUSINESS#${id}`,
  sk: (id: string) => `METADATA#${id}`,
  gsi1pk: (id: string) => `BUSINESS#${id}`,
  gsi1sk: (id: string) => `BUSINESS#${id}`,
};

export const businessRepository = {
  async create(business: Business): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        PK: BusinessKeys.pk(business.id),
        SK: BusinessKeys.sk(business.id),
        ...business,
      },
    };

    await dynamoDB.put(params).promise();
  },

  async getById(businessId: string): Promise<Business> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK: BusinessKeys.pk(businessId),
        SK: BusinessKeys.sk(businessId),
      },
    };

    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      throw new Error(`Business not found: ${businessId}`);
    }
    return result.Item as Business;
  },
};
