import { APIGatewayProxyEvent } from "aws-lambda";
import { CreateProductDTO } from "../../types/product";

import * as productService from "../../services/product.service";
import { lambdaHandler, formatResponse } from "../../utils/handler.utils";
import { HttpCode, HttpError } from "../../utils/http.utils";

function validateBody(body: CreateProductDTO) {
  const { title, description, count, price } = body;
  const errors: string[] = [];

  if (!title || typeof title !== "string") errors.push("Title is missing or invalid.");

  if (typeof description !== "string") errors.push("Description is missing or invalid.");

  if (!price || typeof price !== "number") errors.push("Price is missing or invalid.");

  if (!count || typeof count !== "number") errors.push("Count is missing or invalid.");

  return errors;
}

export const main = lambdaHandler(async (event: APIGatewayProxyEvent) => {
  const body: CreateProductDTO = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  const errors = validateBody(body);
  if (errors.length) {
    throw new HttpError(HttpCode.BAD_REQUEST, errors.join(" "));
  }

  const product = await productService.createOne(body);
  return formatResponse(product, HttpCode.CREATED);
});
