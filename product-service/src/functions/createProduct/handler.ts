import { APIGatewayProxyEvent } from "aws-lambda";
import { CreateProductDTO } from "../../types/product";

import * as productService from "../../services/product.service";
import { lambdaHandler } from "../../utils/handler.utils";

export const main = lambdaHandler((event: APIGatewayProxyEvent) => {
  const { title, description, count, price }: CreateProductDTO =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  // validate data

  return productService.createOne({ title, description, count, price });
});
