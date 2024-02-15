import { ApiHandler } from "sst/node/api";
import { db } from "../../core/src/sql/index";
import { users } from "../../core/src/sql/schema";

export const handler = ApiHandler(async (_evt) => {
  const response = await db.select().from(users);

  return {
    body: JSON.stringify(response, null, 2),
  };
});
