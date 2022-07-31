import type { AWS } from "@serverless/typescript";
import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";

const serverlessConfiguration: AWS = {
  service: "import-service-rs-aws-bootcamp-be",
  frameworkVersion: "3",
  useDotenv: true,
  plugins: ["serverless-esbuild", "serverless-offline"],
  // plugins: ["serverless-auto-swagger", "serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    stage: "dev",
    region: "us-east-1",
    profile: "${env:AWS_PROFILE}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:ListBucket"],
            Resource: ["arn:aws:s3:::${self:custom.importServiceBucket.name}"],
          },
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: ["arn:aws:s3:::${self:custom.importServiceBucket.name}/*"],
          },
        ],
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
      title: "RS-AWS Product Shop Import Service API",
    },
    importServiceBucket: {
      name: "import-service-rs-aws-bootcamp-be",
    },
  },
  package: { individually: true },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;