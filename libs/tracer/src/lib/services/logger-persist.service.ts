/* eslint-disable */
import { Inject, Injectable } from "@nestjs/common";
import * as chalk from "chalk";
import { Console } from "console";
import { LoggerDurationService } from "./logger-duration.service";
import { LoggerUtilsService } from "./logger-utils.service";
import { LOGGER_CONFIG } from "../utils/logger.constants";
import { ILoggerConfig } from "../utils/logger-config.interface";
import * as util from "util";
import * as fs from "fs";
import { Log } from "../utils/log.model";
import * as path from "path";

@Injectable()
export class LoggerPersistService {
  protected _console: Console = new Console(process.stdout);
  protected context = chalk.bgHex("#053610").hex("#ffffff").bold("💾[ Logger Persist Service ]");

  constructor(
    @Inject(LOGGER_CONFIG) protected readonly config: ILoggerConfig,
    protected readonly durationService: LoggerDurationService,
    protected readonly utilsService: LoggerUtilsService,
  ) {}

  private _metadataConsole(): Console {
    return this.config.LOGGER_DISPLAY_METADATA ? this._console : undefined;
  }

  public async persistLog(log: Log): Promise<void> {
    if (!this.config.LOGGER_PERSIST) {
      return;
    }

    if (this.config.LOGGER_WRITE_FULL_JSON_AT_END_OF_FLOW || this.config.LOGGER_WRITE_TO_FILE) {
      // logging context
      this._metadataConsole()?.log(this.context, "persistLog", log.id);

      // converting timestamps
      log.duration = log.duration?.toString() as any;
      log.startTimestamp = log.startTimestamp?.toString() as any;

      for (let step of log.steps) {
        step.timestamp = step.timestamp?.toString() as any;
        step.duration = step.duration?.toString() as any;
        step.context = this.utilsService.stripAnsi(step.context);
      }

      try {
        const stringified = JSON.stringify(log);

        if (this.config.LOGGER_WRITE_FULL_JSON_AT_END_OF_FLOW) {
          process.stdout.write(stringified);
        }

        if (this.config.LOGGER_WRITE_TO_FILE) {
          const logPath = path.resolve(".", this.config.LOGGER_FILENAME_AND_PATH);
          const exists = fs.existsSync(logPath);
          if (!exists) {
            fs.writeFileSync(logPath, "", { encoding: "utf-8" });
          }

          fs.appendFile(logPath, "," + JSON.stringify(log), (err) => {
            this._metadataConsole()?.log(this.context, "appended log object to file.", err);
          });
        }

        return;
      } catch (err) {
        this._metadataConsole()?.error(
          "🔺🔻",
          this.context,
          "could not persist cached log",
          !this.config.LOGGER_DEBUG_DISABLED
            ? util.inspect(
                err,
                this.config.LOGGER_DEBUG_SHOW_HIDDEN,
                this.config.LOGGER_DEBUG_DEPTH,
                true,
              )
            : err?.constructor?.name,
        );

        return;
      }
    }
  }
}
