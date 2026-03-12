import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import redoc from 'redoc-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('FinFive API')
    .setDescription('FinFive Backend API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FinFive API Docs',

    customCss: `
      body { background-color: #0f172a; }

      .swagger-ui .topbar {
        background-color: #020617;
      }

      .swagger-ui .opblock {
        border-radius: 12px;
        border: 1px solid #1e293b;
      }

      .swagger-ui .info .title {
        color: #38bdf8;
        font-size: 30px;
        font-weight: 700;
      }
    `,

    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
    },
  });

  // Redoc Modern Docs
  app.use(
    '/api/reference',
    redoc({
      title: 'FinFive API Reference',
      specUrl: '/api/docs-json',
      redocOptions: {
        theme: {
          colors: {
            primary: {
              main: '#2563eb',
            },
          },
        },
      },
    }),
  );

  await app.listen(port);

  console.log(`🚀 Server running: http://localhost:${port}`);
  console.log(`📘 Swagger Docs: http://localhost:${port}/api/docs`);
  console.log(`📗 Modern Docs: http://localhost:${port}/api/reference`);
}

bootstrap();