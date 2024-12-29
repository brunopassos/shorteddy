import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { AppModule } from './app.module';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

async function bootstrap() {
  const isSentryEnabled = process.env.SENTRY_ENABLED === 'true';
  const PORT = process.env.PORT

  if (isSentryEnabled) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
    });
  }

  const app = await NestFactory.create(AppModule);

  if (isSentryEnabled) {
    app.useGlobalInterceptors(new SentryInterceptor());
  }

  app.useLogger(['log', 'debug', 'error', 'warn']);
  
  await app.listen(Number(PORT), '0.0.0.0');
}
bootstrap();
