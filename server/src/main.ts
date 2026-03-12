import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 3000;

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('FinFive API')
    .setDescription('FinFive Backend API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FinFive API Docs',

    // CDN assets (important for Vercel / serverless)
    customCssUrl:
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',

    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],

    customfavIcon:
      'https://unpkg.com/swagger-ui-dist@5/favicon-32x32.png',

    // Modern UI styling
    customCss: `
      body {
        background-color: #0f172a;
      }

      .swagger-ui .topbar {
        background-color: #020617;
        border-bottom: 1px solid #1e293b;
      }

      .swagger-ui .topbar-wrapper span {
        display: none;
      }

      .swagger-ui .info .title {
        color: #38bdf8;
        font-size: 30px;
        font-weight: 700;
      }

      .swagger-ui .scheme-container {
        background: #020617;
        border-radius: 12px;
        border: 1px solid #1e293b;
        box-shadow: none;
      }

      .swagger-ui .opblock {
        border-radius: 12px;
        border: 1px solid #1e293b;
        margin-bottom: 10px;
      }

      .swagger-ui .opblock-summary {
        font-weight: 600;
      }

      .swagger-ui .btn.execute {
        background-color: #38bdf8;
        border-color: #38bdf8;
      }

      .swagger-ui .btn.authorize {
        background-color: #22c55e;
        border-color: #22c55e;
      }

      .swagger-ui .responses-inner {
        border-radius: 10px;
      }
    `,

    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
      tryItOutEnabled: true,
    },
  });

  await app.listen(port);

  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
}

bootstrap();