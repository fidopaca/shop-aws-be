import { handler as getProductsList } from "../handlers/getProductsList";
import products from "../db/products.json";

test("it should be equal to products", async () => {
    const { body, statusCode } = await getProductsList();
    const result = JSON.parse(body);
    expect(result).toEqual(products);
    expect(statusCode).toBe(200);
});
