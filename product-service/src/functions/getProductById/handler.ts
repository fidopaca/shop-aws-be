import { APIGatewayProxyEvent } from "aws-lambda";

import * as productService from "../../services/product.service";
import { lambdaHandler } from "../../utils/handler.utils";

export const main = lambdaHandler((event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters;

  return productService.getById(productId);
});
