import AWS from "aws-sdk";

if (process.env.AWS_ENDPOINT_URL) {
  const localstackConfig = {
    endpoint: process.env.AWS_ENDPOINT_URL,
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
