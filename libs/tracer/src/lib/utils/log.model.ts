import { LogType } from "./logger-types.enum";

export class LogStep {
  context?: string;
  timestamp?: bigint;
  duration?: number;
  type: keyof typeof LogType;
  arguments: any[];
}

export class Log {
  id: string;
  flow?: any;
  steps?: LogStep[];
  infoCount?: number;
  errorCount?: number;
  warnCount?: number;
  catastrophicCount?: number;
  cleanupCount?: number;
  durationFriendly?: string;
  duration?: bigint;
  updatedAt?: Date | string;
  startTimestamp?: bigint;
}
