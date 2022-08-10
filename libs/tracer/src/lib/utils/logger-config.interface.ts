export interface ILoggerConfig {
  /** @default false  disabled logging logic from running entirely */
  LOGGER_DISABLED?: boolean;
  /**@default false  @true objects passsed to the logger will be displayed in full on the console */
  LOGGER_DEBUG_DISABLED?: boolean;
  /** @default 6 the depth being passed on to util.inspect */
  LOGGER_DEBUG_DEPTH?: number;
  /** @default false wether to show hidden properties on objects via util.inspect call */
  LOGGER_DEBUG_SHOW_HIDDEN?: boolean;

  /** @default \n if you wish to not have any kind of spaces between step logs, set this to @false  */
  LOGGER_STEP_SEPARATOR?: string | false;
  /**@default 8 */
  LOGGER_ID_LENGTH?: number;
  /** @default true @true to display info logs on the console */
  LOGGER_DISPLAY_INFO?: boolean;
  /** @default true @true to display error logs on the console */
  LOGGER_DISPLAY_ERROR?: boolean;
  /** @default true @true to display warn logs on the console */
  LOGGER_DISPLAY_WARN?: boolean;
  /** @default true @true to display cleanup logs on the console */
  LOGGER_DISPLAY_CLEANUP?: boolean;
  /** @default true @true to display catastrophic logs on the console */
  LOGGER_DISPLAY_CATASTROPHIC?: boolean;
  /** @default true @true to display  duration between logs on the console */
  LOGGER_DISPLAY_DURATION?: boolean;
  /** @default 5000 the top end of the duration in milliseconds for colorising duration logs */
  LOGGER_VISUALISED_DURATION_MAX?: number;
  /** @default 0 the low end of the duration in milliseconds for colorising duration logs */
  LOGGER_VISUALISED_DURATION_MIN?: number;
  /** @default true  prevents durations from being calculated entirely */
  LOGGER_CALCULATE_DURATION?: boolean;
  /** @default false @true to save logs to database in the finalize stage of Logger Interceptor */
  LOGGER_PERSIST?: boolean;
  /** @default false @true to upsert the log with every logging step to database */
  LOGGER_PERSIST_CONTINUOUSLY?: boolean;
  /** @default true  @true will persist all objects and their nested values passed to log calls  */
  LOGGER_PERSIST_DEBUG_ARGUMENTS?: boolean;
  /** @default false @true to display logs related to persisting and logger operations on the console */
  LOGGER_DISPLAY_METADATA?: boolean;
  /**
   * @default false persistContinuously must be @false and persist must be @true for this to work
   * if @true, it will only persist log journeys if they contained an error log
   */
  LOGGER_PERSIST_ERROR?: boolean;
  /**
   * @default false persistContinuously must be @false and persist must be @true for this to work
   * if @true, it will only persist log journeys if they contained a cleanup log
   */
  LOGGER_PERSIST_CLEANUP?: boolean;
  /**
   * @default false persistContinuously must be @false and persist must be @true for this to work
   * if @true, it will only persist log journeys if they contained a warn log
   */
  LOGGER_PERSIST_WARN?: boolean;
  /**
   * @default false persistContinuously must be @false and persist must be @true for this to work
   * if @true, it will only persist log journeys if they contained a catastrophic log
   */
  LOGGER_PERSIST_CATASTROPHIC?: boolean;
  /**
   * @default where the log file will be saved
   */
  LOGGER_FILENAME_AND_PATH?: string;

  /**
   * @default true
   */
  LOGGER_WRITE_TO_FILE?: boolean;

  /**
   * @default false
   */
  LOGGER_WRITE_FULL_JSON_AT_END_OF_FLOW?: boolean;
}
