import { APIGatewayProxyEvent } from "aws-lambda";
import { HttpCode, HttpError } from "../../utils/http.utils";

import * as productService from "../../services/product.service";
import { formatResponse, lambdaHandler } from "../../utils/handler.utils";

export const main = lambdaHandler(async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters;

  if (!productId || productId.trim().length === 0 || typeof productId !== "string") {
    throw new HttpError(HttpCode.BAD_REQUEST, "Invalid productId.");
  }

  const product = await productService.getById(productId);

  if (!product) {
    throw new HttpError(HttpCode.NOT_FOUND, "Product not found.");
  }

  return formatResponse(product, HttpCode.OK);
});
