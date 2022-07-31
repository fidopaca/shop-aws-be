import { APIGatewayProxyEvent, S3Event } from "aws-lambda";

import { HttpCode, HttpError } from "./http.utils";
import logger from "./logger.utils";

// const CORS_HEADERS = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Credentials": true,
// };

/* Helper to handle base lambda logic */
export const lambdaHandler =
  (controllerCallback: (event: APIGatewayProxyEvent | S3Event) => Promise<ResponseBody>) =>
  async (event: APIGatewayProxyEvent ) => {
    const { body, pathParameters, queryStringParameters } = event;
    let statusCode: HttpCode;
    let result: ResponseBody;

    try {
      logger.log("REQ ===>", { pathParameters, queryStringParameters, body });
      result = await controllerCallback(event);
      logger.log(`RES <=== [${result.statusCode}]`, result);
    } catch (err) {
      if (err instanceof HttpError) {
        result.statusCode = err.statusCode;
        result.body = JSON.stringify({ message: err.message });
      } else {
        result.statusCode = HttpCode.SERVER_ERROR;
        result.body = JSON.stringify({ message: "Internal server error." });
      }

      logger.error(`ERR <=== [${statusCode}] `, err.message, err.stack);
    } finally {
      return result;
    }
  };

export const pathHandler = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, "/")}`;
};

type ResponseBody = {
  statusCode: number;
  body: string;
  headers?: {
    [index: string]: string | boolean;
  };
};

export const formatResponse = (response: any, statusCode: HttpCode = HttpCode.OK): ResponseBody => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      // "Content-Type": "application/json",
    },
  };
};
