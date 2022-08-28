import type { AWS } from "@serverless/typescript";

import basicAuthorizer from "@functions/basicAuthorizer";

const serverlessConfiguration: AWS = {
    service: "authorization-service",
    frameworkVersion: "3",
    plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        stage: "dev",
        region: "us-east-1",
        profile: "fidopaca-futurecodelab",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
        },
    },
    resources: {
        Outputs: {
          basicAuthorizerArn: {
                Value: {
                    "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"],
                },
            },
        },
    },
    // import the function via paths
    functions: { basicAuthorizer },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ["aws-sdk"],
            target: "node14",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
