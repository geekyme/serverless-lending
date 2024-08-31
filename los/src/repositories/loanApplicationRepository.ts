import { dynamoDB } from "../config/awsConfig";
import { LoanApplication } from "../models/loanApplication";
import { Document } from "../models/document";

const LoanApplicationKeys = {
  pk: (id: string) => `APPLICATION#${id}`,
  sk: (id: string) => `METADATA#${id}`,
  gsi1pk: (businessId: string) => `BUSINESS#${businessId}`,
  gsi1sk: (id: string) => `APPLICATION#${id}`,
};

export const loanApplicationRepository = {
  dynamoDB,
  async create(loanApplication: LoanApplication): Promise<void> {
    const params = {
      TableName: "LoanApplications",
      Item: {
        PK: LoanApplicationKeys.pk(loanApplication.id),
        SK: LoanApplicationKeys.sk(loanApplication.id),
        GSI1PK: LoanApplicationKeys.gsi1pk(loanApplication.businessId),
        GSI1SK: LoanApplicationKeys.gsi1sk(loanApplication.id),
        ...loanApplication,
      },
    };

    await dynamoDB.put(params).promise();
  },

  async getById(applicationId: string): Promise<LoanApplication> {
    const params = {
      TableName: "LoanApplications",
      Key: {
        PK: LoanApplicationKeys.pk(applicationId),
        SK: LoanApplicationKeys.sk(applicationId),
      },
    };

    const result = await dynamoDB.get(params).promise();
    return result.Item as LoanApplication;
  },

  async addDocument(document: Document): Promise<void> {
    const params = {
      TableName: "LoanApplications",
      Key: {
        PK: LoanApplicationKeys.pk(document.applicationId),
        SK: LoanApplicationKeys.sk(document.applicationId),
      },
      UpdateExpression:
        "SET documents = list_append(if_not_exists(documents, :empty_list), :document)",
      ExpressionAttributeValues: {
        ":document": [document],
        ":empty_list": [],
      },
    };

    await dynamoDB.update(params).promise();
  },
};
