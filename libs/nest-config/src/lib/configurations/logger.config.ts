import type { ILoggerConfig } from "@yeo/tracer";
import * as path from "path";

export class LoggerConfig implements ILoggerConfig {
  LOGGER_DISABLED = false;
  LOGGER_DEBUG_DISABLED = false;
  LOGGER_DEBUG_DEPTH = 8;
  LOGGER_DEBUG_SHOW_HIDDEN = true;
  LOGGER_STEP_SEPARATOR = "\n";
  LOGGER_ID_LENGTH = 12;
  LOGGER_DISPLAY_INFO = true;
  LOGGER_DISPLAY_ERROR = true;
  LOGGER_DISPLAY_WARN = true;
  LOGGER_DISPLAY_CLEANUP = true;
  LOGGER_DISPLAY_CATASTROPHIC = true;
  LOGGER_DISPLAY_DURATION = true;
  LOGGER_VISUALISED_DURATION_MAX = 100;
  LOGGER_VISUALISED_DURATION_MIN = 0;
  LOGGER_CALCULATE_DURATION = true;
  LOGGER_PERSIST = true;
  LOGGER_PERSIST_CONTINUOUSLY = false;
  LOGGER_PERSIST_DEBUG_ARGUMENTS = true;
  LOGGER_DISPLAY_METADATA = false;
  LOGGER_PERSIST_ERROR = false;
  LOGGER_PERSIST_CLEANUP = false;
  LOGGER_PERSIST_WARN = false;
  LOGGER_PERSIST_CATASTROPHIC = false;
  LOGGER_FILENAME_AND_PATH = path.resolve(".", "log-file.json");
  LOGGER_WRITE_TO_FILE = process.env.ENVIRONMENT ? false : true;
  LOGGER_WRITE_FULL_JSON_AT_END_OF_FLOW = process.env.ENVIRONMENT ? true : false;
}

export interface ILogFlow {
  // user-related uniquely identifying data
  userId?: string;
  userEmail?: string;
  sessionId?: string;

  // input data
  eventPayload?: any;
  requestBody?: any;
  requestQuery?: any;
  endpoint?: string;
  socketEvent?: string;
  graphQl?: {
    fieldName?: string;
    arguments?: any;
  };

  // general
  agent?: string;
  ip?: string;
}

export class LoggerTestConfig implements ILoggerConfig {
  LOGGER_DISABLED = true;
}
