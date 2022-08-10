import { LoggerService } from "@nestjs/common";
import * as chalk from "chalk";
import { ILog } from "../utils/log-operation.interface";
import { LogType } from "../utils/logger-types.enum";
import { LoggerCacheService } from "./logger-cache.service";
import { LoggerPersistService } from "./logger-persist.service";
import { YeoTracerService } from "./yeo-tracer.service";

export class NestLoggerService implements LoggerService {
  private context = chalk.bgHex("#030221").bold.hex("#ffffff")("[Nest Logger]");

  constructor(
    protected tracer: YeoTracerService,
    protected readonly persistService: LoggerPersistService,
    protected readonly cacheService: LoggerCacheService,
  ) {}

  log(message: any, ...optionalParams: any[]) {
    const log = this.tracer.init();
    log.context = this.context;

    this.tracer.info(log, message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    const log = this.tracer.init();
    log.context = this.context;

    this.tracer.error(log, message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    const log = this.tracer.init();
    log.context = this.context;

    this.tracer.warn(log, message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    const log = this.tracer.init();
    log.context = this.context;

    this.tracer.info(log, "DEBUG", message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    const log = this.tracer.init();
    log.context = this.context;

    this.tracer.info(log, "VERBOSE", message, ...optionalParams);
  }

  private _persistAndFinalize(log: ILog) {
    log.context = this.context;

    const cached = this.cacheService.cacheLog(log, LogType.FINALISE);
    this.persistService.persistLog(cached).then(() => {
      this.cacheService.removeCachedLog(log.id);
      this.tracer.finalize();
    });
  }
}
