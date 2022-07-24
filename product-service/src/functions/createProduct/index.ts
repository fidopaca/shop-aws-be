import { handlerPath } from "../../utils/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors:true,
        summary: "Create a new product",
        description: "Cool API description is here",
      },
    },
  ],
};
