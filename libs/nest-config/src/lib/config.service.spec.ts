import { Test, TestingModule } from "@nestjs/testing";
import { EcpConfigService } from "./config.service";
import { AppConfig } from "./configurations/app.config";
import { AuthConfig } from "./configurations/auth.config";
import { AllConfigs } from "./configurations/config.types";
import { LoggerConfig } from "./configurations/logger.config";

describe("EcpConfigService", () => {
  let app: TestingModule;
  const env = process.env;

  let allConfigs: EcpConfigService<AllConfigs>;
  let appConfig: EcpConfigService<AppConfig>;
  let authConfig: EcpConfigService<AuthConfig>;
  let loggerConfig: EcpConfigService<LoggerConfig>;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...env };

    app = await Test.createTestingModule({
      providers: [EcpConfigService],
    }).compile();

    allConfigs = app.get<EcpConfigService<AllConfigs>>(EcpConfigService);
    appConfig = app.get<EcpConfigService<AppConfig>>(EcpConfigService);
    authConfig = app.get<EcpConfigService<AuthConfig>>(EcpConfigService);
    loggerConfig = app.get<EcpConfigService<LoggerConfig>>(EcpConfigService);
  });

  it("should retrieve default config for every generic", () => {
    // getting a configuration from a service instance with all configs should still work
    const corsEnabled = allConfigs.get("CORS_ENABLED");
    expect(corsEnabled).toStrictEqual(new AppConfig().CORS_ENABLED);

    const apiUrl = appConfig.get("API_URI");
    expect(apiUrl).toStrictEqual(new AppConfig().API_URI);

    const keyCloakClientId = authConfig.get("KEYCLOAK_CLIENT_ID");
    expect(keyCloakClientId).toStrictEqual(new AuthConfig().KEYCLOAK_CLIENT_ID);

    const globalPrefix = appConfig.get("GLOBAL_PREFIX");
    expect(globalPrefix).toStrictEqual(new AppConfig().GLOBAL_PREFIX);
  });

  it("should use the environment config for every generic", () => {
    // values we're overwriting with
    const overwrittenAllConfig = "OVERWRITTEN_CORS_ENABLED";
    const overwrittenAppConfig = "OVERWRITTEN_API_URI";
    const overwrittenAuthConfig = "OVERWRITTEN_KEYCLOAK_CLIENT_ID";
    const overwrittenLoggerConfig = "OVERWRITTEN_LOGGER_DISABLED";
    const overwrittenPrefixConfig = "OVERWRITTEN_PREFIX";

    // loading overwrites into environment

    process.env.CONFIG_CORS_ENABLED = overwrittenAllConfig;
    process.env.CONFIG_API_URI = overwrittenAppConfig;
    process.env.CONFIG_KEYCLOAK_CLIENT_ID = overwrittenAuthConfig;
    process.env.CONFIG_LOGGER_DISABLED = overwrittenLoggerConfig;
    process.env.CONFIG_GLOBAL_PREFIX = overwrittenPrefixConfig;

    // expecting them to be overwritten
    const corsEnabled = allConfigs.get("CORS_ENABLED");
    expect(corsEnabled).toStrictEqual(overwrittenAllConfig);

    const apiUrl = appConfig.get("API_URI");
    expect(apiUrl).toStrictEqual(overwrittenAppConfig);

    const keyCloakClientId = authConfig.get("KEYCLOAK_CLIENT_ID");
    expect(keyCloakClientId).toStrictEqual(overwrittenAuthConfig);

    const loggerEnabled = loggerConfig.get("LOGGER_DISABLED");
    expect(loggerEnabled).toStrictEqual(overwrittenLoggerConfig);
    const globalPrefix = appConfig.get("GLOBAL_PREFIX");
    expect(globalPrefix).toStrictEqual(overwrittenPrefixConfig);
  });

  // this test feels a bit overkill useless but kind-of added for coverage
  // I like calling this `the bureaucrat approach`
  it("should return different CORS origins based on environment", () => {
    expect(appConfig.get("CORS_ORIGINS")()).toStrictEqual(appConfig.get("DEFAULT_CORS_ORIGINS"));

    process.env.ENVIRONMENT = "development";
    expect(appConfig.get("CORS_ORIGINS")()).toStrictEqual(appConfig.get("DEV_CORS_ORIGINS"));

    process.env.ENVIRONMENT = "staging";
    expect(appConfig.get("CORS_ORIGINS")()).toStrictEqual(appConfig.get("STAGE_CORS_ORIGINS"));

    process.env.ENVIRONMENT = "production";
    expect(appConfig.get("CORS_ORIGINS")()).toStrictEqual(appConfig.get("PROD_CORS_ORIGINS"));

    delete process.env.ENVIRONMENT;
  });

  afterEach(async () => {
    process.env = env;
    await app.close();
  });
});
