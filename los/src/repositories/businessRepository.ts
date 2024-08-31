import { dynamoDB } from "../config/awsConfig";
import { Business } from "../models/business";

export const BusinessKeys = {
  pk: (id: string) => `BUSINESS#${id}`,
  sk: (id: string) => `METADATA#${id}`,
  gsi1pk: (id: string) => `BUSINESS#${id}`,
  gsi1sk: (id: string) => `BUSINESS#${id}`,
};

export const businessRepository = {
  async create(business: Business): Promise<void> {
    const params = {
      TableName: "Businesses",
      Item: {
        PK: BusinessKeys.pk(business.id),
        SK: BusinessKeys.sk(business.id),
        ...business,
      },
    };

    await dynamoDB.put(params).promise();
  },
};
