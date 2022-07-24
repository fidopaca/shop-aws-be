import { handler as getProductsById } from "../handlers/getProductsById";

const WRONG_ID = { pathParameters: { productId: "9e1fc533-3289-4f16-9afd-198cc4010000" } };
const PROD_ID = { pathParameters: { productId: "9e1fc533-3289-4f16-9afd-198cc4017242" } };
const PROD_TITLE = "nullam molestie nibh";

test("it should return product not found", async () => {
    const { body, statusCode } = await getProductsById(WRONG_ID);
    const result = JSON.parse(body);
    expect(result.error).toMatch(/not found/);
    expect(statusCode).toBe(404);
});

test("it should return product", async () => {
    const { body, statusCode } = await getProductsById(PROD_ID);
    const result = JSON.parse(body);

    expect(result.title).toEqual(PROD_TITLE);
    expect(statusCode).toBe(200);
});
