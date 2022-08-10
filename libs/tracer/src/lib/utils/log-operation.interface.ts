export interface ILog {
  id: string;
  flow?: any;
  timestamp?: bigint;
  duration?: number;
  startTimestamp?: bigint;
  context?: string;
}
