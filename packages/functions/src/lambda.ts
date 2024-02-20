import { ApiHandler } from "sst/node/api";
import { db } from "@drizzle-sst/core/sql";
import { users } from "@drizzle-sst/core/sql/schema";

export const handler = ApiHandler(async (_evt) => {
  const response = await db.select().from(users);

  return {
    body: JSON.stringify(response, null, 2),
  };
});
