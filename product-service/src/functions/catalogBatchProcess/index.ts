import { pathHandler } from "../../utils/handler.utils";

export default {
  handler: `${pathHandler(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        maximumBatchingWindow: 60,
        arn: {
          "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
        },
      },
    },
  ],
};
