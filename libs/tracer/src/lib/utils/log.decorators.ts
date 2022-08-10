import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ILog } from "./log-operation.interface";
import { GqlExecutionContext } from "@nestjs/graphql";

export const GetGraphqlReqLog = createParamDecorator(
  (context: string, ctx: ExecutionContext): ILog => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const { req } = gqlContext.getContext();

    const log: ILog = { ...req.log, context };

    return log;
  },
);

export const GetHttpReqLog = createParamDecorator(
  (context: string, ctx: ExecutionContext): ILog => {
    const request: Request & { log: ILog } = ctx.switchToHttp().getRequest();

    const log: ILog = { ...request.log, context };

    return log;
  },
);
