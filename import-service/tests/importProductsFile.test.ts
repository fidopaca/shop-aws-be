import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { main as handler } from "../src/functions/importProductsFile/handler";

const s3Mock = mockClient(S3Client);

describe("import products file lambda", () => {
  beforeEach(() => {
    s3Mock.reset();
    s3Mock.on(GetObjectCommand).resolves({});
  });

  it("should return response 200 with signed URL", async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: { name: "test.csv" },
    } as any;

    const result = (await handler(event)) as APIGatewayProxyResult;
    expect(result.statusCode).toEqual(200);
    expect(result.body).toContain(`https://import-service-rs-aws-bootcamp-be`);
  });
});
