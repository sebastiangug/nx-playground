import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  AppConfig,
  LoggerConfig,
  YeoConfigModule,
  YeoConfigService,
} from '@yeo/nest-config';
import { YeoTracerModule } from '@yeo/tracer';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RootResolver } from './resolvers/root.resolver';

@Module({
  imports: [
    YeoConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [YeoConfigModule],
      useFactory: (configService: YeoConfigService<AppConfig>) => {
        const config: ApolloDriverConfig = {
          debug: true,
          playground: true,
          autoSchemaFile: true,
          sortSchema: true,
        };
        const origins = configService.get('CORS_ORIGINS')();
        config.cors = { origin: origins, credentials: true };
        config.path = '/apis/graphql-server/graphql';
        return config;
      },
      inject: [YeoConfigService],
    }),
    YeoTracerModule.forRootAsync({
      imports: [YeoConfigModule],
      useFactory: (loggerConfig: YeoConfigService<LoggerConfig>) =>
        loggerConfig.getLoggerConfig(),
      inject: [YeoConfigService],
    }),
  ],
  controllers: [],
  providers: [RootResolver],
})
export class GraphqlServerAppModule {}
