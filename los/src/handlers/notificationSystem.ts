import { Handler } from "aws-lambda";
import { SNS } from "aws-sdk";
import { sns } from "../config/awsConfig";

export const handler: Handler = async (event) => {
  try {
    const { applicationId, message, recipient } = event;

    const params: SNS.PublishInput = {
      Message: message,
      TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
      MessageAttributes: {
        applicationId: {
          DataType: "String",
          StringValue: applicationId,
        },
        recipient: {
          DataType: "String",
          StringValue: recipient,
        },
      },
    };

    await sns.publish(params).promise();

    return { message: "Notification sent successfully" };
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
