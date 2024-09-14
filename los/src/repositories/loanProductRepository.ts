import { dynamoDB } from "../config/awsConfig";
import { LoanProduct } from "../models/loanProduct";

const TABLE_NAME = "LoanProducts";

const LoanProductKeys = {
  pk: (id: string) => `PRODUCT#${id}`,
  sk: (versionNumber: number) => `VERSION#${versionNumber}`,
  gsi1pk: () => "PRODUCT",
  gsi1sk: (productType: string) => productType,
};

export const loanProductRepository = {
  async create(product: LoanProduct): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        PK: LoanProductKeys.pk(product.productId),
        SK: LoanProductKeys.sk(product.versionNumber),
        GSI1PK: LoanProductKeys.gsi1pk(),
        GSI1SK: LoanProductKeys.gsi1sk(product.productType),
        ...product,
      },
    };

    await dynamoDB.put(params).promise();
  },

  async getById(
    productId: string,
    versionNumber?: number
  ): Promise<LoanProduct> {
    if (versionNumber) {
      const params = {
        TableName: TABLE_NAME,
        Key: {
          PK: LoanProductKeys.pk(productId),
          SK: LoanProductKeys.sk(versionNumber),
        },
      };

      const result = await dynamoDB.get(params).promise();
      if (!result.Item) {
        throw new Error(
          `Loan product not found: ${productId}, version: ${versionNumber}`
        );
      }
      return result.Item as LoanProduct;
    } else {
      // Get the latest version
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": LoanProductKeys.pk(productId),
        },
        ScanIndexForward: false,
        Limit: 1,
      };

      const result = await dynamoDB.query(params).promise();
      if (!result.Items || result.Items.length === 0) {
        throw new Error(`Loan product not found: ${productId}`);
      }
      return result.Items[0] as LoanProduct;
    }
  },

  async update(product: LoanProduct): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK: LoanProductKeys.pk(product.productId),
        SK: LoanProductKeys.sk(product.versionNumber),
      },
      UpdateExpression:
        "set productName = :pn, productType = :pt, minLoanAmount = :min, maxLoanAmount = :max, interestRateType = :irt, baseInterestRate = :bir, termOptions = :to, eligibilityCriteria = :ec, fees = :f, collateralRequirements = :cr, underwritingGuidelines = :ug, #status = :s, updatedAt = :ua",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":pn": product.productName,
        ":pt": product.productType,
        ":min": product.minLoanAmount,
        ":max": product.maxLoanAmount,
        ":irt": product.interestRateType,
        ":bir": product.baseInterestRate,
        ":to": product.termOptions,
        ":ec": product.eligibilityCriteria,
        ":f": product.fees,
        ":cr": product.collateralRequirements,
        ":ug": product.underwritingGuidelines,
        ":s": product.status,
        ":ua": new Date().toISOString(),
      },
    };

    await dynamoDB.update(params).promise();
  },

  async list(): Promise<LoanProduct[]> {
    const params = {
      TableName: TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: {
        ":pk": LoanProductKeys.gsi1pk(),
      },
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items as LoanProduct[];
  },

  async search(criteria: {
    productType?: LoanProduct["productType"];
    minAmount?: number;
    maxAmount?: number;
    interestRateType?: LoanProduct["interestRateType"];
  }): Promise<LoanProduct[]> {
    let filterExpression = "";
    let expressionAttributeValues: any = {
      ":pk": LoanProductKeys.gsi1pk(),
    };

    if (criteria.productType) {
      filterExpression += "productType = :pt";
      expressionAttributeValues[":pt"] = criteria.productType;
    }

    if (criteria.minAmount) {
      filterExpression += filterExpression ? " AND " : "";
      filterExpression += "minLoanAmount >= :min";
      expressionAttributeValues[":min"] = criteria.minAmount;
    }

    if (criteria.maxAmount) {
      filterExpression += filterExpression ? " AND " : "";
      filterExpression += "maxLoanAmount <= :max";
      expressionAttributeValues[":max"] = criteria.maxAmount;
    }

    if (criteria.interestRateType) {
      filterExpression += filterExpression ? " AND " : "";
      filterExpression += "interestRateType = :irt";
      expressionAttributeValues[":irt"] = criteria.interestRateType;
    }

    const params = {
      TableName: TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      FilterExpression: filterExpression || undefined,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items as LoanProduct[];
  },
};
