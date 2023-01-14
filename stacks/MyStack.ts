import { StackContext, Api, RDS } from "sst/constructs";

export function MyStack({ stack }: StackContext) {
  const rds = new RDS(stack, "rds", {
    defaultDatabaseName: "myapp",
    engine: "postgresql11.13",
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [rds],
        copyFiles: [
          {
            from: "packages/core/migrations",
            to: "migrations",
          },
        ],
      },
      
    },
    routes: {
      "GET /": 'packages/functions/src/lambda.handler',
      "GET /migrate": 'packages/functions/src/migrator.handler'
    },
  });

  // Custom resource notes
  // @serverless-stack/resources/src/Script/index.handlers

  // Get resources in outputs for debug purposes
  stack.addOutputs({
    ApiEndpoint: api.url,
    RDS_ARN: rds.clusterArn,
    RDS_SECRET: rds.secretArn,
    RDS_DATABASE: rds.defaultDatabaseName,
  });
}
