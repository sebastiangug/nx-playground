import { Module } from "@nestjs/common";
import { LoggerCacheService } from "./services/logger-cache.service";
import { LoggerDurationService } from "./services/logger-duration.service";
import { LoggerPersistService } from "./services/logger-persist.service";
import { LoggerUtilsService } from "./services/logger-utils.service";
import { YeoTracerService } from "./services/yeo-tracer.service";

@Module({
  providers: [
    YeoTracerService,
    LoggerCacheService,
    LoggerDurationService,
    LoggerPersistService,
    LoggerUtilsService,
  ],
  exports: [
    YeoTracerService,
    LoggerCacheService,
    LoggerDurationService,
    LoggerPersistService,
    LoggerUtilsService,
  ],
})
export class LoggerRootModule {}
