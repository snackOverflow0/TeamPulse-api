import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors'; // 🔌 Import logger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global runtime body validation rules
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 🚀 Mount the logging observability engine globally
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(5000);
  console.log('🚀 TeamPulse API running smoothly on http://localhost:5000');
}
bootstrap();