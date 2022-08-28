import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import { middyfy } from "@libs/lambda";
import { Unauthorized } from "http-errors";

const generatePolicy = (principalId, resource, effect = "Allow"): APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: effect,
                Resource: resource,
            },
        ],
    },
});

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
    console.log("EVENT ===> ", event);
    try {
        if (event.type !== "TOKEN") {
            console.log("Event has no token");
            throw new Unauthorized();
        }

        const { authorizationToken, methodArn } = event;

        const token = authorizationToken.replace("Basic ", "");
        const buffer = Buffer.from(token, "base64");
        const [username, password] = buffer.toString("utf8").split(":");

        const effect = process.env[username] && process.env[username] == password ? "Allow" : "Deny";

        return generatePolicy(token, methodArn, effect);
    } catch (error) {
        console.log("ERROR ===>", error);
        throw error;
    }
};

export const main = middyfy(basicAuthorizer);
