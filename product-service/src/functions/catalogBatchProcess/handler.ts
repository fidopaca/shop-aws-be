import { SQSEvent } from "aws-lambda";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

import * as productService from "../../services/product.service";
import { formatResponse, lambdaHandler } from "../../utils/handler.utils";
import { HttpCode } from "../../utils/http.utils";

export const catalogBatchProcess = async (event: SQSEvent) => {
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
    return formatResponse(records, HttpCode.OK);
  } catch (error) {
    throw error;
  }
}

export const main = lambdaHandler(catalogBatchProcess);
