import { handlerPath } from "../../utils/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{productId}",
        cors:true,
        summary: "Get product by productId",
        description: "Cool API description is here",
        bodyType: "CreateProductDTO"
      },
    },
  ],
};
