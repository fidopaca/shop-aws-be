import { APIGatewayProxyEvent } from "aws-lambda";
import { HttpCode } from "../../utils/http.utils";

import * as productService from "../../services/product.service";
import { formatResponse, lambdaHandler } from "../../utils/handler.utils";

export const main = lambdaHandler(async (_event: APIGatewayProxyEvent) => {
  const products = await productService.getAll();
  return formatResponse(products, HttpCode.OK);
});
