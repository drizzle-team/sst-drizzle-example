## SST + Drizzle ORM example project

---

Current example was inspired by and created from twitch stream -> https://www.twitch.tv/videos/1704293186

In this stream [@thdr](https://github.com/thdxr) tried to use Prisma + Kysely to setup automatic database migrations using sst


### We have prepared simple MVP example of how to achieve both migrations and ORM functionality using just Drizzle ORM

<br />

> ### Note: Current example just showing a possibility to use drizzle orm in serverless environment using AWS Lambda/Custom Resources/etc. 
> #### In next versions of those examples we can setup Custom resources, by examples how SST Team already did [here](https://github.com/serverless-stack/sst/blob/a50f63baa944c897fd02e631fc8dd56bd42e5f38/packages/resources/src/RDS.ts#L521)

<br />
<br />

# Initial setup

We used [create-sst](https://www.npmjs.com/package/create-sst) bootstrap script

```bash
npx create-sst@rc
```

For Drizzle ORM versions we are currently using internal(alfa) version, where we have just added `AWS DataApi` driver support

```bash
pnpm i drizzle-orm@latest drizzle-orm-pg@0.15.2-2b4d90d
pnpm i drizzle-kit -D
```
<br />
<br />

# Project sctructure

In this repo you may found same project structure as `create-sst` script will generate. Just few things were added: 
<br />

1. [`packages/core/sql/index.ts`](https://github.com/drizzle-team/sst-drizzle-example/blob/main/packages/core/src/sql/index.ts)

Current file contain drizzle `AwsDataApi` connection setup + drizzle migrations setup. You can check more about drizzle-orm and drizzle-kit usage
```typescript
import { drizzle } from "drizzle-orm-pg/aws-datapi";
import { migrate as mig } from "drizzle-orm-pg/aws-datapi/migrator";
import { RDS } from "sst/node/rds";
import { RDSDataClient } from "@aws-sdk/client-rds-data";

export const db = drizzle(new RDSDataClient({}), {
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
import { integer, pgTable, text } from "drizzle-orm-pg";

export const users = pgTable('users', {
    id: integer('id').primaryKey(),
    name: text('name')
})
```
<br />

3. We have added 2 Lambda Functions
    - `lambda.ts` -> check, that query to newly created database was invoked without errors
    - `migrator.ts` -> lambda, that currently invoked using API, to simulate migration process from lambda code

# How to run this example
1. Run cdk bootstrap command 
```
pnpm run cdk:bootstrap aws://<account-id>/<region> --profile <profile>
```
2. Run sst deploy
```
pnpm run deploy
```
3. From outputs use ApiGateway base url 
    - `/migrator` - to simulate migration process
    - `/` - to check if query is working as expected