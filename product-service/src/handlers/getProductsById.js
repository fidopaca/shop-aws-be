"use strict";

import http2 from "http2";
import { getById } from "../db/products.repository";
import { formatJSONResponse } from "../lib/formatJSONResponse";

export const handler = async (event) => {
    try {
        const { productId } = event.pathParameters;
        const product = await getById(productId);

        if (!product) {
            return formatJSONResponse(http2.constants.HTTP_STATUS_NOT_FOUND, {
                error: `Product with id "${productId}" not found!`,
            });
        }

        return formatJSONResponse(http2.constants.HTTP_STATUS_OK, product);
    } catch (error) {
        return formatJSONResponse(error.statusCode || http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
            error: error.message,
        });
    }
};
