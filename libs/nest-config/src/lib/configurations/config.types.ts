import { AppConfig } from "./app.config";
import { AuthConfig } from "./auth.config";
import { LoggerConfig } from "./logger.config";

export type AllConfigs = AppConfig & AuthConfig & LoggerConfig;

export type ConfigGenericTypeUnion = AppConfig | AuthConfig | LoggerConfig;
