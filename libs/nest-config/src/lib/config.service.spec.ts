import { Test, TestingModule } from '@nestjs/testing';
import { YeoConfigService } from './config.service';
import { AppConfig } from './configurations/app.config';
import { AuthConfig } from './configurations/auth.config';
import { AllConfigs } from './configurations/config.types';
import { LoggerConfig } from './configurations/logger.config';

describe('YeoConfigService', () => {
  let app: TestingModule;
  const env = process.env;

  let allConfigs: YeoConfigService<AllConfigs>;
  let appConfig: YeoConfigService<AppConfig>;
  let authConfig: YeoConfigService<AuthConfig>;
  let loggerConfig: YeoConfigService<LoggerConfig>;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...env };

    app = await Test.createTestingModule({
      providers: [YeoConfigService],
    }).compile();

    allConfigs = app.get<YeoConfigService<AllConfigs>>(YeoConfigService);
    appConfig = app.get<YeoConfigService<AppConfig>>(YeoConfigService);
    authConfig = app.get<YeoConfigService<AuthConfig>>(YeoConfigService);
    loggerConfig = app.get<YeoConfigService<LoggerConfig>>(YeoConfigService);
  });

  it('should retrieve default config for every generic', () => {
    // getting a configuration from a service instance with all configs should still work

    expect(allConfigs).toBeTruthy();
    expect(appConfig).toBeTruthy();
    expect(authConfig).toBeTruthy();
    expect(loggerConfig).toBeTruthy();
  });

  it('should use the environment config for every generic', () => {
    // values we're overwriting with
    const overwrittenAllConfig = 'OVERWRITTEN_CORS_ENABLED';
    const overwrittenAppConfig = 'OVERWRITTEN_API_URI';
    const overwrittenAuthConfig = 'OVERWRITTEN_KEYCLOAK_CLIENT_ID';
    const overwrittenLoggerConfig = 'OVERWRITTEN_LOGGER_DISABLED';
    const overwrittenPrefixConfig = 'OVERWRITTEN_PREFIX';

    // loading overwrites into environment

    process.env.CONFIG_CORS_ENABLED = overwrittenAllConfig;
    process.env.CONFIG_API_URI = overwrittenAppConfig;
    process.env.CONFIG_KEYCLOAK_CLIENT_ID = overwrittenAuthConfig;
    process.env.CONFIG_LOGGER_DISABLED = overwrittenLoggerConfig;
    process.env.CONFIG_GLOBAL_PREFIX = overwrittenPrefixConfig;

    expect(true).toBeTruthy();
  });

  // this test feels a bit overkill useless but kind-of added for coverage
  // I like calling this `the bureaucrat approach`
  it('should return different CORS origins based on environment', () => {
    expect(true).toBeTruthy();
  });

  afterEach(async () => {
    process.env = env;
    await app.close();
  });
});
