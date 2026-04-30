import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception-filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 1. Global Validator & transformation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: true }));

  // 2. Global error handler
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3. Global response transformer
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. Swagger/OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('Task API')
    .setDescription('A simple task management API with auth, validation, global handlers, and response formatting')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port || 3000);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation is available at: http://localhost:${port}/api`);

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     forbidNonWhitelisted: true, // Extra safety
  //   }),
  // );

  // const port = process.env.PORT || 3000;
  // await app.listen(port);
  // console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
