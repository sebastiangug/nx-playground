import { AppConfig } from "./configurations/app.config";
import { AuthConfig } from "./configurations/auth.config";
import { AllConfigs } from "./configurations/config.types";
import { LoggerConfig } from "./configurations/logger.config";
import { GetConfig } from "./get-config.function";

describe("GetConfig function", () => {
  const env = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...env };
  });

  it("should retrieve default config for every generic", () => {
    // getting a configuration from a service instance with all configs should still work
    const corsEnabled = GetConfig<AppConfig>()("CORS_ENABLED");
    expect(corsEnabled).toStrictEqual(new AppConfig().CORS_ENABLED);

    const apiUrl = GetConfig<AppConfig>()("API_URI");
    expect(apiUrl).toStrictEqual(new AppConfig().API_URI);

    const keyCloakClientId = GetConfig<AuthConfig>()("KEYCLOAK_CLIENT_ID");
    expect(keyCloakClientId).toStrictEqual(new AuthConfig().KEYCLOAK_CLIENT_ID);

    const globalPrefix = GetConfig<AppConfig>()("GLOBAL_PREFIX");
    expect(globalPrefix).toStrictEqual(new AppConfig().GLOBAL_PREFIX);
  });

  it("should use the environment config for every generic", () => {
    // values we're overwriting with
    const overwrittenAllConfig = "OVERWRITTEN_CORS_ENABLED";
    const overwrittenAppConfig = "OVERWRITTEN_API_URI";
    const overwrittenAuthConfig = "OVERWRITTEN_KEYCLOAK_CLIENT_ID";
    const overwrittenLoggerConfig = "OVERWRITTEN_LOGGER_DISABLED";
    const overwrittenPrefixConfig = "OVERWRITTEN_PREFIX";

    process.env.CONFIG_CORS_ENABLED = overwrittenAllConfig;
    process.env.CONFIG_API_URI = overwrittenAppConfig;
    process.env.CONFIG_KEYCLOAK_CLIENT_ID = overwrittenAuthConfig;
    process.env.CONFIG_LOGGER_DISABLED = overwrittenLoggerConfig;
    process.env.CONFIG_GLOBAL_PREFIX = overwrittenPrefixConfig;

    // expecting them to be overwritten
    const corsEnabled = GetConfig<AllConfigs>()("CORS_ENABLED");
    expect(corsEnabled).toStrictEqual(overwrittenAllConfig);

    const apiUrl = GetConfig<AppConfig>()("API_URI");
    expect(apiUrl).toStrictEqual(overwrittenAppConfig);

    const keyCloakClientId = GetConfig<AuthConfig>()("KEYCLOAK_CLIENT_ID");
    expect(keyCloakClientId).toStrictEqual(overwrittenAuthConfig);

    const loggerEnabled = GetConfig<LoggerConfig>()("LOGGER_DISABLED");
    expect(loggerEnabled).toStrictEqual(overwrittenLoggerConfig);
    const globalPrefix = GetConfig<AppConfig>()("GLOBAL_PREFIX");
    expect(globalPrefix).toStrictEqual(overwrittenPrefixConfig);
  });

  afterEach(async () => {
    process.env = env;
  });
});
