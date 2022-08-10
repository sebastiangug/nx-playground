import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import * as chalk from "chalk";
import { YeoTracerService } from "../services/yeo-tracer.service";
import { LoggerCacheService } from "../services/logger-cache.service";
import { LoggerPersistService } from "../services/logger-persist.service";
import { LoggerDurationService } from "../services/logger-duration.service";
import { LogType } from "../utils/logger-types.enum";
import { ILog } from "../utils/log-operation.interface";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private context = chalk.bgHex("#030221").bold.hex("#ffffff")("[Logger Interceptor]");

  constructor(
    protected readonly tracer: YeoTracerService,
    protected readonly durationService: LoggerDurationService,
    protected readonly persistService: LoggerPersistService,
    protected readonly cacheService: LoggerCacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // extracting possible contexsts
    const req = context.switchToHttp()?.getRequest();
    const socket = context.switchToWs()?.getClient();
    const payload: { eventName?: string } = context.switchToWs().getData();
    const contextType = context.getType<GqlContextType>();
    const log: ILog = this.tracer.init();

    switch (contextType) {
      case "http": {
        log.context = this.context;
        log.flow.agent = req?.headers["user-agent"];
        log.flow.ip = req?.ip;
        log.flow.endpoint = req?.path;
        log.flow.requestBody = { ...req.body };
        log.flow.requestQuery = { ...req.query };
        if (req.query) {
          if (req.query.password) {
            req.query.password = "INTERCEPTED";
          }

          log.flow.requestQuery = req.query;
        }

        if (log.flow?.requestBody?.password) {
          log.flow.requestBody.password = "INTERCEPTED";
        }

        req.log = log;
        this.tracer.info(
          log,
          "incoming http request " + req?.path,
          "request body",
          log?.flow?.requestBody,
          "request query",
          log?.flow?.requestQuery,
        );
        break;
      }

      case "graphql": {
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext();
        const info = gqlContext.getInfo();

        log.context = this.context;
        log.flow.agent = req?.headers["user-agent"];
        log.flow.ip = req?.ip;
        log.flow.endpoint = req.path;
        log.flow.requestBody = req.body;
        log.flow.graphQl = {
          fieldName: info?.fieldName,
          arguments: info?.fieldNodes?.[0]?.arguments?.map((el) => {
            const arg = {};
            arg[el?.name?.value] = el?.value?.value;
            return arg;
          }),
        };
        req.log = log;

        this.tracer.info(
          log,
          "incoming graphql request",
          "field name",
          log?.flow?.graphQl?.fieldName,
          "arguments",
          log?.flow?.graphQl?.arguments,
        );

        break;
      }

      case "ws": {
        log.context = this.context;
        log.flow.agent = socket?.handshake?.headers["user-agent"];
        log.flow.ip = socket?.conn.remoteAddress;
        log.flow.socketEvent = payload?.eventName;

        if ((payload as any)?.password) {
          (payload as any).password = "INTERCEPTED";
        }

        log.flow.eventPayload = { ...payload };
        socket.log = log;

        this.tracer.info(
          log,
          "incoming ws event " + payload?.eventName,
          "event payload",
          log?.flow?.eventPayload,
        );
        break;
      }
      default:
        break;
    }

    return next.handle().pipe(
      catchError((exception) => {
        log.context = this.context;
        this.tracer.error(log, exception?.message);
        return throwError(() => exception);
      }),
      finalize(() => {
        log.context = this.context;
        const duration_friendly = this.durationService.getFlowDuration(log.startTimestamp)[1];
        this.tracer.info(log, "finished in " + duration_friendly);

        const cached = this.cacheService.cacheLog(log, LogType.FINALISE);
        this.persistService.persistLog(cached).then(() => {
          this.cacheService.removeCachedLog(log.id);
          this.tracer.finalize();
        });
      }),
    );
  }
}
