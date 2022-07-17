"use strict";

const http2 = require("http2");
const { getById } = require("../db/products.repository");
const { formatJSONResponse } = require("../lib/formatJSONResponse");

module.exports.handler = async (event) => {
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
