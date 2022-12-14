import { AppConfig } from "./configurations/app.config";
import { AuthConfig } from "./configurations/auth.config";
import { AllConfigs, ConfigGenericTypeUnion } from "./configurations/config.types";
import { LoggerConfig } from "./configurations/logger.config";

const appConfig: AppConfig = new AppConfig();
const authConfig: AuthConfig = new AuthConfig();
const loggerConfig: LoggerConfig = new LoggerConfig();

const configs: AllConfigs = {
  ...appConfig,
  ...authConfig,
  ...loggerConfig,
};

export const GetConfig =
  <T extends ConfigGenericTypeUnion>() =>
  <K extends keyof T>(key: K): T[K] => {
    // if a configuration was overwritten in the env, return that instead
    if (process.env[`CONFIG_${key}`]) {
      let config = process.env[`CONFIG_${key}`] as any;

      // we try to parse it in case it's an object or something
      try {
        config = JSON.parse(config);
      } catch (err) {
        // we don't do anything as it wasn't parsable
      }

      return config;
    }

    return (configs as T)[key];
  };
