import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { APIGatewayProxyEvent } from "aws-lambda";
import { HttpCode } from "../../utils/http.utils";
import { formatResponse, lambdaHandler } from "../../utils/handler.utils";

export const main = lambdaHandler(async (event: APIGatewayProxyEvent) => {
  const { name } = event.queryStringParameters;

  const s3Client = new S3Client({ region: "us-east-1" });
  const bucketParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${name}`,
    ContentTyoe: "text/csv",
  };

  try {
    const command = new PutObjectCommand(bucketParams);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return formatResponse(signedUrl, HttpCode.OK);
  } catch (error) {
    throw error;
  }
});
