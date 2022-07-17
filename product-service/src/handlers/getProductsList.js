"use strict";
const http2 = require("http2");
const { getAll } = require("../db/products.repository");
const { formatJSONResponse } = require("../lib/formatJSONResponse");

module.exports.handler = async (event) => {
    try {
        const productList = (await getAll()) || [];
        return formatJSONResponse(http2.constants.HTTP_STATUS_OK, productList);
    } catch (error) {
        return formatJSONResponse(error.statusCode || http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
            error: error.message,
        });
    }
};
