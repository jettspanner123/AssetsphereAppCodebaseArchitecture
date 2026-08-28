import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './AppModule';
import { HttpExceptionGlobalFilter } from './Filters/HttpExceptionGlobalFilter';
import { ApplicationRouteFactory } from './Factories/ApplicationRouteFactory';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global Exception Filter conforming to ApiResponseClass envelope
  app.useGlobalFilters(new HttpExceptionGlobalFilter());

  // Global Validation Pipe with automatic transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // CORS enablement
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // OpenAPI Document Generation
  const config = new DocumentBuilder()
    .setTitle('Assetsphere AI Microservice API')
    .setDescription('Enterprise AI orchestration, telemetry diagnostics, and predictive hardware health analytics')
    .setVersion('1.0.0')
    .addTag('HealthCheck')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve raw OpenAPI JSON specification
  app.getHttpAdapter().get(ApplicationRouteFactory.DocumentationRoutes.OpenApiSpec, (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  // Mount Scalar API Reference Documentation on /Api/V1/Documentation
  app.use(
    ApplicationRouteFactory.DocumentationRoutes.ControllerURL,
    apiReference({
      spec: {
        content: document,
      },
    })
  );

  const port = parseInt(process.env.PORT || '8000', 10);
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 AssetsphereAIServiceLayerMSC running on: http://localhost:${port}`);
  logger.log(`📖 Scalar API Reference available at: http://localhost:${port}${ApplicationRouteFactory.DocumentationRoutes.ControllerURL}`);
  logger.log(`📄 OpenAPI Spec JSON available at: http://localhost:${port}${ApplicationRouteFactory.DocumentationRoutes.OpenApiSpec}`);
  logger.log(`🩺 HealthCheck endpoint: http://localhost:${port}/${ApplicationRouteFactory.HealthCheckRoutes.ControllerURL}`);
}

bootstrap().catch((err: Error) => {
  new Logger('Bootstrap').error(`Failed to start application: ${err.message}`, err.stack);
  process.exit(1);
});
