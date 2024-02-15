import { migrate } from "@drizzle-sst/core/sql";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  // when running locally using pnpm run dev, the migrations are in a different location
  const pathToMigrations = process.env.IS_LOCAL
    ? "packages/core/migrations"
    : "migrations";

  await migrate(pathToMigrations);

  return {
    body: "Migrated!",
  };
});
