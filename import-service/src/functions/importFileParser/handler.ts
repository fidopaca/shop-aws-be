import { S3Event } from "aws-lambda";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { HttpCode } from "../../utils/http.utils";
import { formatResponse, lambdaHandler } from "../../utils/handler.utils";
import logger from "../../utils/logger.utils";
import parseCSV from "csv-parser";

export const main = lambdaHandler(async (event: S3Event) => {
  logger.log("EVENT RECORD ===> ", event.Records[0]);
  const {
    awsRegion,
    s3: { bucket, object: s3Object },
  } = event.Records[0];

  const s3Client = new S3Client({ region: awsRegion });
  const bucketParams = {
    Bucket: bucket.name,
    Key: s3Object.key,
  };

  try {
    const command = new GetObjectCommand(bucketParams);
    const streamData = await s3Client.send(command);

    const data = await streamToString(streamData.Body);
    logger.log("PARSED DATA ===> ", data);
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: bucket.name,
        CopySource: `${bucket.name}/${s3Object.key}`,
        Key: s3Object.key.replace("uploaded", "parsed"),
      })
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket.name,
        Key: s3Object.key,
      })
    );

    return formatResponse("CSV parsed.", HttpCode.OK);
  } catch (error) {
    throw error;
  }
});

const streamToString = async (stream) =>
  new Promise((resolve, reject) => {
    console.log("streaming file");
    const chunks = [];
    stream
      .pipe(parseCSV())
      .on("data", (chunk) => chunks.push(chunk))
      .on("error", reject)
      .on("end", () => resolve(JSON.stringify(chunks, null, 2)));
  });
