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
