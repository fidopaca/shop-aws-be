import type { AWS } from "@serverless/typescript";
import * as dotenv from "dotenv";
import getProducts from "@functions/getProductsList";
import getProductById from "@functions/getProductById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

dotenv.config();

const serverlessConfiguration: AWS = {
  service: "rs-aws-bootcamp-be",
  frameworkVersion: "3",
  useDotenv: true,
  plugins: ["serverless-auto-swagger", "serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    stage: "dev",
    region: "us-east-1",
    profile: "fidopaca-futurecodelab",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
          },
        ],
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: [
          {
            Ref: "createProductTopic",
          },
        ],
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
      SNS_TOPIC_ARN: {
        Ref: "createProductTopic",
      },
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk", "pg-native"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    "serverless-offline": {
      httpPort: 8000,
    },
    autoswagger: {
      apiType: "http",
      basePath: "/${self:provider.stage}",
      title: "RS-AWS Product Shop API",
    },
  },
  package: { individually: true },
  functions: { getProducts, getProductById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      createProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: "fidopaca@gmail.com",
          TopicArn: {
            Ref: "createProductTopic",
          },
        },
      },
      createProductOverstockSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: "fedaipaca@gmail.com",
          TopicArn: {
            Ref: "createProductTopic",
          },
          FilterPolicy:{
            overstock: ["true"]
          }
        },
      },
    },
    Outputs: {
      sqsURL: {
        Value: {
          Ref: "catalogItemsQueue"
        }
      },
      sqsArn: {
        Value: {
          "Fn::GetAtt": [
             "catalogItemsQueue",
             "Arn"
          ]
       }
      }
    }
  },
};

module.exports = serverlessConfiguration;
