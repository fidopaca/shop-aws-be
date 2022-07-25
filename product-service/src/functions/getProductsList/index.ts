import { pathHandler } from "../../utils/handler.utils";

export default {
  handler: `${pathHandler(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        cors:true,
        summary: "Get all products",
        // description: "Cool API description is here",
        responses:{
          200:{
            description: "All products.",
            bodyType: "Product"
          },
          500: {
            description: "Server error.",
          },
        }
      },
    },
  ],
};
