import { pathHandler } from "../../utils/handler.utils";

export default {
  handler: `${pathHandler(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors:true,
        summary: "Create a new product",
        // description: "Cool API description is here",
        bodyType: "CreateProductDTO",
        responses:{
          201:{
            description: "New product created.",
            bodyType: "Product"
          },
          400: {
            description: "One or more inputs are invalid or missing.",
          },
          500: {
            description: "Server error.",
          },
        }
      },
    },
  ],
};
