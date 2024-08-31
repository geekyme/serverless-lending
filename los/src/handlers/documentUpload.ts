import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { loanApplicationRepository } from "../repositories/loanApplicationRepository";
import { Document } from "../models/document";
import { s3 } from "../config/awsConfig";
import { StepFunctions } from "aws-sdk";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { applicationId, documentType, fileContent, fileName } = body;

    if (!applicationId || !documentType || !fileContent || !fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const documentId = uuidv4();
    const key = `${applicationId}/${documentId}-${fileName}`;

    // Upload file to S3
    await s3
      .putObject({
        Bucket: process.env.DOCUMENTS_BUCKET || "",
        Key: key,
        Body: Buffer.from(fileContent, "base64"),
        ContentType: "application/octet-stream",
      })
      .promise();

    // Create document record
    const document: Document = {
      id: documentId,
      applicationId,
      documentType,
      fileLocation: key,
      uploadDate: new Date().toISOString(),
    };

    // Add document to the loan application
    await loanApplicationRepository.addDocument(document);

    // Start the Step Function execution
    const stepFunctions = new StepFunctions();
    await stepFunctions
      .startExecution({
        stateMachineArn: process.env.LOAN_APPLICATION_WORKFLOW_ARN || "",
        input: JSON.stringify({ applicationId }),
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ documentId, key }),
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error uploading document" }),
    };
  }
};
