import { pathHandler } from "../../utils/handler.utils";

export default {
  handler: `${pathHandler(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{productId}",
        cors: true,
        summary: "Get product by productId",
        // description: "Cool API description is here",
        responses:{
          200:{
            description: "Found product with given productId.",
            bodyType: "Product"
          },
          400: {
            description: "Product id is invalid or missing in the paramater.",
          },
          404: {
            description: "Product not found.",
          },
          500: {
            description: "Server error.",
          },
        }
      },
    },
  ],
};
