import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { loanProductRepository } from "../repositories/loanProductRepository";
import { LoanProduct } from "../models/loanProduct";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    switch (event.httpMethod) {
      case "POST":
        if (event.path === "/loan-products") {
          return createLoanProduct(event);
        } else if (event.path.endsWith("/versions")) {
          return createLoanProductVersion(event);
        }
        break;
      case "GET":
        if (event.path === "/loan-products") {
          return listLoanProducts();
        } else if (event.path.includes("/versions/")) {
          return getLoanProductVersion(event);
        } else if (event.path.endsWith("/versions")) {
          return listLoanProductVersions(event);
        } else if (event.path.startsWith("/loan-products/search")) {
          return searchLoanProducts(event);
        } else {
          return getLoanProduct(event);
        }
      case "PUT":
        return updateLoanProduct(event);
      case "DELETE":
        return deprecateLoanProduct(event);
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

function createLoanProduct(event: any) {
  const productData = JSON.parse(event.body || "{}");
  const product: LoanProduct = {
    productId: uuidv4(),
    versionNumber: 1,
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...productData,
  };

  return loanProductRepository.create(product).then(() => ({
    statusCode: 201,
    body: JSON.stringify(product),
  }));
}

function listLoanProducts() {
  return loanProductRepository.list().then((products) => ({
    statusCode: 200,
    body: JSON.stringify(products),
  }));
}

function getLoanProduct(event: any) {
  const productId = event.pathParameters?.productId;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Product ID is required" }),
    };
  }

  return loanProductRepository
    .getById(productId)
    .then((product) => ({
      statusCode: 200,
      body: JSON.stringify(product),
    }))
    .catch((error) => ({
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    }));
}

function updateLoanProduct(event: any) {
  const productId = event.pathParameters?.productId;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Product ID is required" }),
    };
  }

  const productData = JSON.parse(event.body || "{}");
  console.log("productData", productData);
  return loanProductRepository
    .getById(productId)
    .then((existingProduct) => {
      console.log("existingProduct", existingProduct);
      const updatedProduct: LoanProduct = {
        ...existingProduct,
        ...productData,
        updatedAt: new Date().toISOString(),
      };

      return loanProductRepository.update(updatedProduct).then(() => ({
        statusCode: 200,
        body: JSON.stringify(updatedProduct),
      }));
    })
    .catch((error) => {
      console.error("error", error);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    });
}

function deprecateLoanProduct(event: any) {
  const productId = event.pathParameters?.productId;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Product ID is required" }),
    };
  }

  return loanProductRepository
    .getById(productId)
    .then((existingProduct) => {
      const deprecatedProduct: LoanProduct = {
        ...existingProduct,
        status: "Deprecated",
        updatedAt: new Date().toISOString(),
      };

      return loanProductRepository.update(deprecatedProduct).then(() => ({
        statusCode: 204,
        body: "",
      }));
    })
    .catch((error) => ({
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    }));
}

function createLoanProductVersion(event: any) {
  const productId = event.pathParameters?.productId;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Product ID is required" }),
    };
  }

  return loanProductRepository
    .getById(productId)
    .then((existingProduct) => {
      const productData = JSON.parse(event.body || "{}");
      const newVersion: LoanProduct = {
        ...existingProduct,
        ...productData,
        versionNumber: existingProduct.versionNumber + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return loanProductRepository.create(newVersion).then(() => ({
        statusCode: 201,
        body: JSON.stringify(newVersion),
      }));
    })
    .catch((error) => ({
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    }));
}

function listLoanProductVersions(event: any) {
  // Implementation for listing all versions of a loan product
  // This would require additional query in the repository
  return {
    statusCode: 501,
    body: JSON.stringify({ message: "Not implemented" }),
  };
}

function getLoanProductVersion(event: any) {
  const productId = event.pathParameters?.productId;
  const versionNumber = parseInt(
    event.pathParameters?.versionNumber || "1",
    10
  );

  if (!productId || isNaN(versionNumber)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Product ID and valid version number are required",
      }),
    };
  }

  return loanProductRepository
    .getById(productId, versionNumber)
    .then((product) => ({
      statusCode: 200,
      body: JSON.stringify(product),
    }))
    .catch((error) => ({
      statusCode: 404,
      body: JSON.stringify({ message: "Product version not found" }),
    }));
}

function searchLoanProducts(event: any) {
  const { productType, minAmount, maxAmount, interestRateType } =
    event.queryStringParameters || {};

  const criteria = {
    productType,
    minAmount: minAmount ? parseFloat(minAmount) : undefined,
    maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    interestRateType,
  };

  return loanProductRepository.search(criteria).then((products) => ({
    statusCode: 200,
    body: JSON.stringify(products),
  }));
}
