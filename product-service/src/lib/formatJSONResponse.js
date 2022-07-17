const CORS_HEADERS = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
};

const formatJSONResponse = (statusCode, body, headers = CORS_HEADERS) => ({
    statusCode,
    headers,
    body: JSON.stringify(body, null, 2),
});

module.exports = {
    CORS_HEADERS,
    formatJSONResponse,
};
