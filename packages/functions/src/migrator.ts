import { migrate } from "@drizzle-sst/core/sql";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const pathToMIgrations = 'migrations'

  await migrate(pathToMIgrations);

  return {
    body: 'Migrated!'
  }
});
