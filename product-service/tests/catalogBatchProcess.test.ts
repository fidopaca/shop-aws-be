import { Client } from "pg";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { mockClient } from "aws-sdk-client-mock";
import { catalogBatchProcess } from "../src/functions/catalogBatchProcess/handler";
import { createOne } from "../src/services/product.service";
import { SQSEvent } from "aws-lambda";

const EVENT = {
    Records: [
        {
            body: JSON.stringify({
                title: "Test product 1 title",
                description: "Test product 1 desc",
                price: "196",
                count: "5",
            }),
        },
        {
            body: JSON.stringify({
                title: "Test product 2 title",
                description: "Test product 2 desc",

                price: "296",
                count: "15",
            }),
        },
        {
            body: JSON.stringify({
                title: "Test product 3 title",
                description: "Test product 3 desc",

                price: "396",
                count: "25",
            }),
        },
    ],
} as SQSEvent;

jest.mock("pg", () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

jest.mock("../src/services/product.service", () => {
    return {
        createOne: jest.fn(),
    };
});

const snsMock = mockClient(SNSClient);

describe("catalog batch process", () => {
    // @ts-ignore
    let client;

    beforeEach(() => {
        client = new Client();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call createOne and PublishCommand as Event.Records.length", async () => {
        snsMock.on(PublishCommand).resolves({
            MessageId: '12345678-1111-2222-3333-111122223333'
        });
        await catalogBatchProcess(EVENT);
        expect(createOne).toBeCalledTimes(EVENT.Records.length);
        expect(snsMock).toHaveReceivedCommand(PublishCommand);
        expect(snsMock).toHaveReceivedCommandTimes(PublishCommand, EVENT.Records.length);
    });
});
