import { SQSEvent } from "aws-lambda";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

import * as productService from "../../services/product.service";
import { lambdaHandler } from "../../utils/handler.utils";

export const main = lambdaHandler(async (event: SQSEvent) => {
  const snsClient = new SNSClient({ region: "us-east-1" });

  try {
    const records = event.Records.map(({ body }) => JSON.parse(body));

    for (const record of records) {
      const product = await productService.createOne(record);
      if (product) {
        const input = {
          Subject: "New product added to Database",
          Message: JSON.stringify(product),
          TopicArn: process.env.SNS_TOPIC_ARN,
          MessageAttributes: {
            overstock: {
              DataType: "String",
              StringValue: +product.count >= 100 ? "true" : "false",
            },
          },
        };

        const command = new PublishCommand(input);
        await snsClient.send(command);
      }
    }
  } catch (error) {
    throw error;
  }
});
