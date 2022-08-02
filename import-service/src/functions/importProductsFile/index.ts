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
        responses:{
          200:{
            description: "Creates and returns a new signed url for upload file to s3 bucket.",
          },
          500: {
            description: "Server error.",
          },
        }
      },
    },
  ],
};
