import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { APIGatewayProxyEvent } from "aws-lambda";
import { HttpCode } from "../../utils/http.utils";
import { formatResponse, lambdaHandler } from "../../utils/handler.utils";

const BUCKET_NAME = "import-service-rs-aws-bootcamp-be";

export const main = lambdaHandler(async (event: APIGatewayProxyEvent) => {
  const { name } = event.queryStringParameters;

  const s3Client = new S3Client({ region: "us-east-1" });
  const bucketParams = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}`,
    ContentTyoe:"text/csv"
  };
  console.log(bucketParams)
  try {
    const command = new PutObjectCommand(bucketParams);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log("Generated Signed Url ====> ", signedUrl);
    return formatResponse(signedUrl, HttpCode.OK);
  } catch (error) {
    console.log("Error while generate signed Url ===> ", error);
    throw error;
  }
});
