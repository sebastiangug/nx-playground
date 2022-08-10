import { Inject, Injectable } from "@nestjs/common";
import * as chalk from "chalk";
import { Console } from "console";
import { Log, LogStep } from "../utils/log.model";
import { LoggerPersistService } from "./logger-persist.service";
import { LoggerDurationService } from "./logger-duration.service";
import { LOGGER_CONFIG } from "../utils/logger.constants";
import { ILoggerConfig } from "../utils/logger-config.interface";
import { LogType } from "../utils/logger-types.enum";
import * as util from "util";
import { ILog } from "../utils/log-operation.interface";

@Injectable()
export class LoggerCacheService<T = unknown> {
  protected _console: Console = new Console(process.stdout);
  protected context = chalk.bgHex("#053610").hex("#ffffff").bold("🔧[ Logger Cache Service ]");

  private CACHE: Log[] = [];

  constructor(
    @Inject(LOGGER_CONFIG) protected readonly config: ILoggerConfig,
    protected readonly persistService: LoggerPersistService,
    protected readonly durationService: LoggerDurationService,
  ) {}

  public cacheLog(log: ILog, type: keyof typeof LogType, ...args: any[]): Log {
    if (this.config.LOGGER_DISABLED) {
      return;
    }

    this._metadataConsole()?.log(this.context, "cache_log");

    try {
      // constructing the initial doc
      const cacheLog: Log = {
        id: log.id,
        startTimestamp: log.startTimestamp,
      };

      // constructing log step
      const step: LogStep = {
        context: log.context,
        type,
        arguments: args,
        timestamp: log.timestamp,
      };

      // finding the cached log
      const log_index = this.CACHE.findIndex((el) => el.id === cacheLog.id);
      // stopping execution if we don't find it locally
      if (log_index === -1) {
        // pushing a new log doc
        this._metadataConsole()?.log(
          this.context,
          "pushing a new cache log " + log.id,
          "existing steps" + this.CACHE[log_index]?.steps?.length,
        );

        step.duration = parseInt(this.durationService.getDuration(log.startTimestamp).toString());

        if (!this.config.LOGGER_DEBUG_DISABLED) {
          this._metadataConsole()?.log(
            this.context,
            "pushing step to cached log",
            util.inspect(
              step,
              this.config.LOGGER_DEBUG_SHOW_HIDDEN,
              this.config.LOGGER_DEBUG_DEPTH,
              true,
            ),
          );
        }

        const new_log = {
          ...cacheLog,
          steps: [{ ...step }],
          flow: log.flow,
        };

        this.CACHE.push(new_log);

        if (!this.config.LOGGER_DEBUG_DISABLED) {
          this._metadataConsole()?.log(
            this.context,
            "pushed new log to cache",
            util.inspect(
              this.CACHE[this.CACHE.length - 1],
              this.config.LOGGER_DEBUG_SHOW_HIDDEN,
              this.config.LOGGER_DEBUG_DEPTH,
              true,
            ),
          );
        }

        if (this.config.LOGGER_PERSIST_CONTINUOUSLY) {
          this.persistService.persistLog(new_log);
        }

        return new_log;
      } else {
        this._metadataConsole()?.log(
          this.context,
          "updating cache log " + log.id,
          "existing steps " + this.CACHE[log_index]?.steps?.length,
        );

        const step_duration = this.durationService.getDuration(
          this.CACHE[log_index].steps[this.CACHE[log_index].steps.length - 1]?.timestamp,
        );

        step.duration = parseInt(step_duration?.toString());

        if (!this.config.LOGGER_DEBUG_DISABLED) {
          this._metadataConsole()?.log(
            this.context,
            "pushing step to cached log",
            util.inspect(
              step,
              this.config.LOGGER_DEBUG_SHOW_HIDDEN,
              this.config.LOGGER_DEBUG_DEPTH,
              true,
            ),
          );
        }

        this.CACHE[log_index].steps.push({
          ...step,
          duration: parseInt(step_duration?.toString()),
        });

        this.CACHE[log_index] = {
          ...this.CACHE[log_index],
          ...cacheLog,
          flow: { ...this.CACHE[log_index]?.flow, ...log.flow },
        };

        if (!this.config.LOGGER_DEBUG_DISABLED) {
          this._metadataConsole()?.log(
            this.context,
            "updated cached log",
            util.inspect(
              this.CACHE[log_index],
              this.config.LOGGER_DEBUG_SHOW_HIDDEN,
              this.config.LOGGER_DEBUG_DEPTH,
              true,
            ),
          );
        }

        if (this.config.LOGGER_PERSIST_CONTINUOUSLY) {
          this.persistService.persistLog(this.CACHE[log_index]);
        }

        return this.CACHE[log_index];
      }
    } catch (err) {
      this._metadataConsole()?.error(
        "🔺🔻",
        this.context,
        "could not update log within cache",
        !this.config.LOGGER_DEBUG_DISABLED
          ? util.inspect(
              err,
              this.config.LOGGER_DEBUG_SHOW_HIDDEN,
              this.config.LOGGER_DEBUG_DEPTH,
              true,
            )
          : err?.constructor?.name,
      );
    }
  }

  public removeCachedLog = (log_id: string): void => {
    this._metadataConsole()?.log(this.context, "remove_cached_log", log_id);

    // looking for log
    const index = this.CACHE.findIndex((el) => el.id === log_id);
    if (index === -1) {
      this._metadataConsole()?.error("🔺🔻", this.context, "could not find cached log to remove");
      return;
    }

    // removing from cache
    const removed = this.CACHE.splice(index, 1);
    this._metadataConsole()?.log(this.context, "removed log from local cache", removed?.[0]?.id);
  };

  private _metadataConsole(): Console {
    return this.config.LOGGER_DISPLAY_METADATA ? this._console : undefined;
  }
}
