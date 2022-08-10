import { Injectable } from '@nestjs/common';
import { LoggerConfig } from './configurations/logger.config';
import { AppConfig } from './configurations/app.config';
import { AuthConfig } from './configurations/auth.config';
import {
  ConfigGenericTypeUnion,
  AllConfigs,
} from './configurations/config.types';

@Injectable()
export class YeoConfigService<T extends ConfigGenericTypeUnion> {
  protected readonly appConfig: AppConfig = new AppConfig();
  protected readonly authConfig: AuthConfig = new AuthConfig();
  protected readonly loggerConfig: LoggerConfig = new LoggerConfig();

  private configs: AllConfigs = {
    ...this.appConfig,
    ...this.authConfig,
    ...this.loggerConfig,
  };

  public get<K extends keyof T>(key: K): T[K] {
    // if a configuration was overwritten in the env, return that instead
    if (process.env[`CONFIG_${String(key)}`]) {
      let config = process.env[`CONFIG_${String(key)}`] as any;

      // we try to parse it in case it's an object or something
      try {
        config = JSON.parse(config);
      } catch (err) {
        // we don't do anything as it wasn't parsable
      }

      return config;
    }

    return this.configs[key as any];
  }

  public getLoggerConfig() {
    return {
      LOGGER_DISABLED: this.get('LOGGER_DISABLED' as any),
      LOGGER_DEBUG_DISABLED: this.get('LOGGER_DEBUG_DISABLED' as any),
      LOGGER_DEBUG_DEPTH: this.get('LOGGER_DEBUG_DEPTH' as any),
      LOGGER_DEBUG_SHOW_HIDDEN: this.get('LOGGER_DEBUG_SHOW_HIDDEN' as any),
      LOGGER_STEP_SEPARATOR: this.get('LOGGER_STEP_SEPARATOR' as any),
      LOGGER_ID_LENGTH: this.get('LOGGER_ID_LENGTH' as any),
      LOGGER_DISPLAY_INFO: this.get('LOGGER_DISPLAY_INFO' as any),
      LOGGER_DISPLAY_ERROR: this.get('LOGGER_DISPLAY_ERROR' as any),
      LOGGER_DISPLAY_WARN: this.get('LOGGER_DISPLAY_WARN' as any),
      LOGGER_DISPLAY_CLEANUP: this.get('LOGGER_DISPLAY_CLEANUP' as any),
      LOGGER_DISPLAY_CATASTROPHIC: this.get(
        'LOGGER_DISPLAY_CATASTROPHIC' as any
      ),
      LOGGER_DISPLAY_DURATION: this.get('LOGGER_DISPLAY_DURATION' as any),
      LOGGER_VISUALISED_DURATION_MAX: this.get(
        'LOGGER_VISUALISED_DURATION_MAX' as any
      ),
      LOGGER_VISUALISED_DURATION_MIN: this.get(
        'LOGGER_VISUALISED_DURATION_MIN' as any
      ),
      LOGGER_CALCULATE_DURATION: this.get('LOGGER_CALCULATE_DURATION' as any),
      LOGGER_PERSIST: this.get('LOGGER_PERSIST' as any),
      LOGGER_PERSIST_CONTINUOUSLY: this.get(
        'LOGGER_PERSIST_CONTINUOUSLY' as any
      ),
      LOGGER_PERSIST_DEBUG_ARGUMENTS: this.get(
        'LOGGER_PERSIST_DEBUG_ARGUMENTS' as any
      ),
      LOGGER_DISPLAY_METADATA: this.get('LOGGER_DISPLAY_METADATA' as any),
      LOGGER_PERSIST_ERROR: this.get('LOGGER_PERSIST_ERROR' as any),
      LOGGER_PERSIST_CLEANUP: this.get('LOGGER_PERSIST_CLEANUP' as any),
      LOGGER_PERSIST_WARN: this.get('LOGGER_PERSIST_WARN' as any),
      LOGGER_PERSIST_CATASTROPHIC: this.get(
        'LOGGER_PERSIST_CATASTROPHIC' as any
      ),
      LOGGER_FILENAME_AND_PATH: this.get('LOGGER_FILENAME_AND_PATH' as any),
      LOGGER_WRITE_TO_FILE: this.get('LOGGER_WRITE_TO_FILE' as any),
      LOGGER_WRITE_FULL_JSON_AT_END_OF_FLOW: this.get(
        'LOGGER_WRITE_FULL_JSON_AT_END_OF_FLOW' as any
      ),
    };
  }
}
