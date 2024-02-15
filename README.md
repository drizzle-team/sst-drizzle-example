## SST + Drizzle ORM example project

---

Current example was inspired by and created from twitch stream -> https://www.twitch.tv/videos/1704293186

In this stream [@thdr](https://github.com/thdxr) tried to use Prisma + Kysely to setup automatic database migrations using sst

---

#### We have prepared simple MVP example of how to achieve both migrations and ORM functionality using just Drizzle ORM

<br />

> Note: Current example just showing a possibility to use drizzle orm in serverless environment using AWS Lambda/Custom Resources/etc.
> In next versions of those examples we can setup Custom resources, by examples how SST Team already did [here](https://github.com/serverless-stack/sst/blob/a50f63baa944c897fd02e631fc8dd56bd42e5f38/packages/resources/src/RDS.ts#L521)

<br />
<br />

# Initial setup

We used [create-sst](https://www.npmjs.com/package/create-sst) bootstrap script

```bash
npx create-sst
```

Add drizzle dependencies to your project using pnpm

```bash
cd packages/core
pnpm i drizzle-orm@latest
pnpm i drizzle-kit -D
```

<br />
<br />

# Project structure

In this repo you may found same project structure as `create-sst` script will generate. Just few things were added:
<br />

1. [`packages/core/sql/index.ts`](https://github.com/drizzle-team/sst-drizzle-example/blob/main/packages/core/src/sql/index.ts)

Current file contain drizzle `AwsDataApi` connection setup + drizzle migrations setup. You can check more about drizzle-orm and drizzle-kit usage

```typescript
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { migrate as mig } from "drizzle-orm/postgres-js/migrator";
import { RDS } from "sst/node/rds";

const rdsClient = new RDSDataClient({});
export const db = drizzle(rdsClient, {
  database: RDS.rds.defaultDatabaseName,
  secretArn: RDS.rds.secretArn,
  resourceArn: RDS.rds.clusterArn,
});

export const migrate = async (path: string) => {
  return mig(db, { migrationsFolder: path });
};
```

<br />

2. [`packages/core/sql/schema.ts`](https://github.com/drizzle-team/sst-drizzle-example/blob/main/packages/core/src/sql/schema.ts)

Current file contains basic table schema definition, that can be used in further queries

```typescript
import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
});
```

<br />

3. We have added 2 Lambda Functions
   - `lambda.ts` -> check, that query to newly created database was invoked without errors
   - `migrator.ts` -> lambda, that currently invoked using API, to simulate migration process from lambda code

# How to run this example

1. Install dependencies

```
pnpm install
```

2. Run the migration script in core package

```
cd packages/core
pnpm run migrate
```

3. Run sst deploy or sst dev from the root of the project

```
pnpm run deploy
```

```
pnpm run dev
```

4. From outputs use ApiGateway base url to invoke lambda functions. You can also run these endpoints from the [SST console](https://console.sst.dev/).
   - `/migrate` - to simulate migration process
   - `/` - to check if query is working as expected

# Add new migrations

Core package has npm script `migrate`. By running this script `drizzle-kit` will generate new sql file in output folder, that was chosen in cli params

For more information you could check drizzle-kit [docs](https://github.com/drizzle-team/drizzle-kit-mirror) and drizzle-orm [docs](https://github.com/drizzle-team/drizzle-orm)
