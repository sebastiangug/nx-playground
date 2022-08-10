import { Args, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { FormatLogContext, GetGraphqlReqLog, ILog, YeoTracerService } from "@yeo/tracer";
import { HealthResponse } from "@yeo/entities";

const context = FormatLogContext("Status Resolver");

@Resolver()
export class RootResolver {
  constructor(protected readonly tracer: YeoTracerService) {}

  @Query((returns) => HealthResponse)
  public getHealth(@GetGraphqlReqLog(context) log: ILog): HealthResponse {
    this.tracer.info(log, "getHealth", status);
    return { status: "HEALTHY" };
  }
}
