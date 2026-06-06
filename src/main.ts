import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { TransformInterceptor } from './common/interceptors/transform.interceptors';
import helmet from 'helmet'; // Import Helmet security headers

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ 1. Secure HTTP headers using Helmet
  app.use(helmet());

  // 🛡️ 2. Enforce explicit CORS policies
  app.enableCors({
    origin: ['http://localhost:3000'], // White-list your frontend client server domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Auto-strip properties that don't match our strict DTO validation contracts
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Mount Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(5000);
  console.log('🚀 TeamPulse API running smoothly on http://localhost:5000');
}
bootstrap();