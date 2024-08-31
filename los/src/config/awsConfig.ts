import AWS from "aws-sdk";

if (process.env.STAGE === "dev") {
  const localstackConfig = {
    endpoint: "http://localstack:4566",
    region: "us-east-1",
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test",
    },
    s3ForcePathStyle: true,
  };

  AWS.config.update(localstackConfig);
}

export const dynamoDB = new AWS.DynamoDB.DocumentClient();
export const s3 = new AWS.S3();
export const sns = new AWS.SNS();
