"use strict";
import http2 from "http2";
import { getAll } from "../db/products.repository";
import { formatJSONResponse } from "../lib/formatJSONResponse";

export const handler = async (event) => {
    try {
        const productList = (await getAll()) || [];
        return formatJSONResponse(http2.constants.HTTP_STATUS_OK, productList);
    } catch (error) {
        return formatJSONResponse(error.statusCode || http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
            error: error.message,
        });
    }
};
