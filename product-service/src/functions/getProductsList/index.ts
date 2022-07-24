import { handlerPath } from "../../utils/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        cors:true,
        summary: "Get all products",
        description: "Cool API description is here",
        responses:{
          200:{
            description: "Successfull API response",
            bodyType: "Product"
          }
        }
      },
    },
  ],
};
