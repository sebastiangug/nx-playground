import { LoggerRootModule } from "./logger-root.module";
import { DynamicModule, Module, Provider, ModuleMetadata } from "@nestjs/common";
import { ILoggerConfig } from "./utils/logger-config.interface";
import { LOGGER_CONFIG } from "./utils/logger.constants";
import * as path from "path";

export interface ILoggerModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (...args: any[]) => Promise<ILoggerConfig> | ILoggerConfig;
  inject?: any[];
}

@Module({})
export class YeoTracerModule {
  public static forRootAsync(options: ILoggerModuleAsyncOptions): DynamicModule {
    return {
      module: YeoTracerModule,
      imports: [LoggerRootModule, ...options.imports],
      providers: [this.createAsyncProvider(options)],
      exports: [LoggerRootModule, LOGGER_CONFIG],
      global: true,
    };
  }

  public static forTest(): DynamicModule {
    return {
      module: YeoTracerModule,
      imports: [LoggerRootModule],
      exports: [LoggerRootModule, LOGGER_CONFIG],
      global: true,
      providers: [
        {
          provide: LOGGER_CONFIG,
          useValue: {
            LOGGER_DISABLED: true,
            LOGGER_DEBUG_DISABLED: false,
            LOGGER_DEBUG_DEPTH: 8,
            LOGGER_DEBUG_SHOW_HIDDEN: true,
            LOGGER_STEP_SEPARATOR: "\n",
            LOGGER_ID_LENGTH: 12,
            LOGGER_DISPLAY_INFO: true,
            LOGGER_DISPLAY_ERROR: true,
            LOGGER_DISPLAY_WARN: true,
            LOGGER_DISPLAY_CLEANUP: true,
            LOGGER_DISPLAY_CATASTROPHIC: true,
            LOGGER_VISUALISED_DURATION_MAX: 50,
            LOGGER_VISUALISED_DURATION_MIN: 0,
            LOGGER_CALCULATE_DURATION: true,
            LOGGER_PERSIST: false,
            LOGGER_PERSIST_CONTINUOUSLY: false,
            LOGGER_PERSIST_DEBUG_ARGUMENTS: true,
            LOGGER_DISPLAY_METADATA: false,
            LOGGER_PERSIST_ERROR: false,
            LOGGER_PERSIST_CLEANUP: false,
            LOGGER_PERSIST_WARN: false,
            LOGGER_PERSIST_CATASTROPHIC: false,
            LOGGER_FILENAME_AND_PATH: path.resolve(".", "logs/log-file.json"),
          },
        },
      ],
    };
  }

  private static createAsyncProvider(options: ILoggerModuleAsyncOptions): Provider {
    return {
      provide: LOGGER_CONFIG,
      useFactory: async (...args: any[]) => await options.useFactory(...args),
      inject: options.inject,
    };
  }
}
