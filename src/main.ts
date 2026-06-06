import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { TransformInterceptor } from './common/interceptors/transform.interceptors'; // 🔌 Import Transformer

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Auto-strip properties that don't match our strict DTO validation contracts
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Mount the global observability logger
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 🚀 Mount the API data formatting layer globally
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(5000);
  console.log('🚀 TeamPulse API running smoothly on http://localhost:5000');
}
bootstrap();