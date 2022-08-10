import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { GraphqlServerAppModule } from './app/graphql-server.app.module';

import {
  LoggerCacheService,
  LoggerDurationService,
  LoggerInterceptor,
  LoggerPersistService,
  NestLoggerService,
  YeoTracerService,
} from '@yeo/tracer';

declare const module: any;

const getApp = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(GraphqlServerAppModule);

  // global interceptors
  const tracerService = app.get<YeoTracerService>(YeoTracerService);
  const loggerDurationService = app.get<LoggerDurationService>(
    LoggerDurationService
  );
  const loggerCacheService = app.get<LoggerCacheService>(LoggerCacheService);
  const loggerPersistService =
    app.get<LoggerPersistService>(LoggerPersistService);
  app.useGlobalInterceptors(
    new LoggerInterceptor(
      tracerService,
      loggerDurationService,
      loggerPersistService,
      loggerCacheService
    )
  );

  app.useLogger(
    new NestLoggerService(
      tracerService,
      loggerPersistService,
      loggerCacheService
    )
  );

  app.setGlobalPrefix('/apis/graphql-server');
  app.use('/apis/graphql-server/health', (req: Request, res: Response) => {
    return res.status(200).send();
  });

  return app;
};

async function bootstrap(): Promise<void> {
  const app = await getApp();
  await app.listen(process.env.PORT ?? 3100);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
