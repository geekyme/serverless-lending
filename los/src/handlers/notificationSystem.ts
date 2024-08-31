import { Handler } from "aws-lambda";
import { SNS } from "aws-sdk";

const sns = new SNS();

export const handler: Handler = async (event) => {
  try {
    const { applicationId, message } = event;

    // Simulate sending notification
    console.log(
      `Sending notification for application ${applicationId}: ${message}`
    );

    // In a real scenario, you would use SNS to send the notification
    // await sns.publish({
    //   TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
    //   Message: JSON.stringify({ applicationId, message }),
    // }).promise();

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
