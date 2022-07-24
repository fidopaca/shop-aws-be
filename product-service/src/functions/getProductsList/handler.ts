import { APIGatewayProxyEvent } from "aws-lambda";

import * as productService from "../../services/product.service";
import { lambdaHandler } from "../../utils/handler.utils";

export const main = lambdaHandler((_event: APIGatewayProxyEvent) => {
  return productService.getAll();
});
