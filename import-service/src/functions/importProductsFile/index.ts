import { pathHandler } from "../../utils/handler.utils";

export default {
  handler: `${pathHandler(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        summary: "Import a csv file contains products",
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        // responses:{
        //   201:{
        //     description: "New product created.",
        //     bodyType: "Product"
        //   },
        //   400: {
        //     description: "One or more inputs are invalid or missing.",
        //   },
        //   500: {
        //     description: "Server error.",
        //   },
        // }
      },
    },
  ],
};
