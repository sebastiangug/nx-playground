import { Inject, Injectable } from "@nestjs/common";
import { Console } from "console";
import * as chalk from "chalk";
import { LoggerCacheService } from "./logger-cache.service";
import { LoggerDurationService } from "./logger-duration.service";
import * as util from "util";
import { LoggerUtilsService } from "./logger-utils.service";

import { ILoggerConfig } from "../utils/logger-config.interface";
import { LogType } from "../utils/logger-types.enum";
import { LOGGER_CONFIG } from "../utils/logger.constants";
import { GenerateId } from "../utils/generate-log-id.function";
import { ILog } from "../utils/log-operation.interface";

@Injectable()
export class YeoTracerService {
  // utils
  private _console: Console = process.env.ENVIRONMENT ? undefined : new Console(process.stdout);
  protected context = chalk.bgHex("#053610").hex("#ffffff").bold("🔧[ Logger Service ]");

  // init
  constructor(
    @Inject(LOGGER_CONFIG) protected readonly config: ILoggerConfig,
    protected readonly cacheService: LoggerCacheService,
    protected readonly durationService: LoggerDurationService,
    protected readonly utilsService: LoggerUtilsService,
  ) {}

  public finalize() {
    if (!this.config.LOGGER_DISABLED) {
      const line = "-".repeat(process.stdout.columns);
      this._console?.log(line);
    }
  }

  public write(...argumentsData: any): void {
    const line = "-".repeat(process.stdout.columns);
    this._console?.log(line);
    this._console?.log(this.config.LOGGER_STEP_SEPARATOR);

    for (const arg of argumentsData) {
      if (!this.config.LOGGER_DEBUG_DISABLED) {
        if (typeof arg === "object") {
          this._console?.log(
            util.inspect(
              arg,
              this.config.LOGGER_DEBUG_SHOW_HIDDEN,
              this.config.LOGGER_DEBUG_DEPTH,
              true,
            ),
          );
        } else {
          this._console?.log("----", arg);
        }
      } else {
        if (typeof arg === "object" && arg instanceof Array) {
          this._console?.log("----", "Array with", arg.length, "entries.");
        } else if (typeof arg === "object") {
          this._console?.log(
            "----",
            arg?.constructor?.name,
            "with",
            Object.keys(arg).length,
            "keys",
          );
        } else {
          this._console?.log("----", arg);
        }
      }
    }

    this._console?.log(this.config.LOGGER_STEP_SEPARATOR);
    this._console?.log(line);
  }

  public init(): ILog {
    return {
      id: this._generateId(),
      flow: {} as any,
      startTimestamp: this.durationService.getTimestamp(),
      timestamp: this.durationService.getTimestamp(),
      context: this.context,
    };
  }

  public async info(log: ILog, ...argumentsData: any): Promise<void> {
    this._processLog(
      log,
      LogType.INFO,
      "🟢 " + chalk.bgHex("#00ff3c").bold(log.context),
      ...argumentsData,
    );

    return;
  }

  public error(log: ILog, ...argumentsData: any) {
    this._processLog(
      log,
      LogType.ERROR,
      "🔴 " +
        chalk.bgRed.bold.hex("#ffffff")(
          log.context ? this.utilsService.stripAnsi(log.context) : `[missing log context]`,
        ),
      ...argumentsData,
    );

    return;
  }

  public warn(log: ILog, ...argumentsData: any) {
    this._processLog(
      log,
      LogType.WARN,
      "⚠️ " + chalk.bgHex("#00ff3c").bold(log.context),
      ...argumentsData,
    );

    return;
  }

  public cleanup(log: ILog, ...argumentsData: any) {
    this._processLog(
      log,
      LogType.CLEANUP,
      "🧹 " + chalk.bgHex("#940404").bold.hex("#ffffff")(log.context),
      ...argumentsData,
    );

    return;
  }

  public catastrophic(log: ILog, ...argumentsData: any) {
    this._processLog(
      log,
      LogType.CATASTROPHIC,
      "💥 " + chalk.bgHex("#ff00b3").bold(log.context),
      ...argumentsData,
    );

    return;
  }

  // shared processing
  private _processLog(
    log: ILog,
    type: LogType,
    logger_context: string,
    ...argumentsData: any
  ): void {
    try {
      // updating log flow
      const flow_log = this.cacheService.cacheLog(log, type, ...argumentsData);

      if (!flow_log) {
        return;
      }

      // calculating duration and setting timestamp for next operation

      let duration_ms: number;
      let colors: [number, number, number];

      if (this.config.LOGGER_CALCULATE_DURATION) {
        log.timestamp = this.durationService.getTimestamp();
        log.duration = flow_log.steps[flow_log.steps.length - 1].duration;
        duration_ms = log.duration / 1000;
        colors = this.durationService.styleDuration(parseInt(duration_ms.toFixed(0)));
      }

      // doing our logging

      if (this.config[`LOGGER_DISPLAY_${type}`]) {
        this._console?.log(
          logger_context,
          chalk.underline(log.id),
          this.config.LOGGER_DISPLAY_DURATION
            ? chalk.bold.rgb(colors[0], colors[1], colors[2])(duration_ms + " ms ")
            : "",
        );

        for (const arg of argumentsData) {
          if (
            !this.config.LOGGER_DEBUG_DISABLED ||
            type === LogType.ERROR ||
            type === LogType.CATASTROPHIC ||
            type === LogType.CLEANUP
          ) {
            if (typeof arg === "object") {
              this._console?.log(
                "----",
                util.inspect(
                  arg,
                  this.config.LOGGER_DEBUG_SHOW_HIDDEN,
                  this.config.LOGGER_DEBUG_DEPTH,
                  true,
                ),
              );
            } else {
              this._console?.log("----", arg);
            }
          } else {
            if (typeof arg === "object" && arg instanceof Array) {
              this._console?.log("----", "Array with", arg.length, "entries.");
            } else if (typeof arg === "object") {
              this._console?.log(
                "----",
                arg?.constructor?.name,
                "with",
                Object.keys(arg).length,
                "keys",
              );
            } else {
              this._console?.log("----", arg);
            }
          }
        }

        if (this.config.LOGGER_STEP_SEPARATOR) {
          this._console?.log(this.config.LOGGER_STEP_SEPARATOR);
        }
      }
    } catch (err) {
      this._metadataConsole()?.error(
        "🔺🔻",
        this.context,
        "could not log " + type + " for " + log?.id,
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

  protected _metadataConsole(): Console {
    return this.config.LOGGER_DISPLAY_METADATA ? this._console : undefined;
  }

  protected _generateId(): string {
    return GenerateId(this.config.LOGGER_ID_LENGTH, true, false, false);
  }
}
