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

  // expose json spec (important for redoc)
  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.json(document);
  });

  // Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FinFive Developer API',

    // Load assets from CDN (fixes Vercel 404)
    customCssUrl: 'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
    ],

    customfavIcon: 'https://unpkg.com/swagger-ui-dist/favicon-32x32.png',

    // Modern UI styling
    customCss: `
      body {
        background-color: #0f172a;
        font-family: Inter, system-ui, sans-serif;
      }

      .swagger-ui .topbar {
        background-color: #020617;
        border-bottom: 1px solid #1e293b;
      }

      .swagger-ui .info .title {
        color: #38bdf8;
        font-size: 32px;
        font-weight: 700;
      }

      .swagger-ui .info .description {
        color: #94a3b8;
      }

      .swagger-ui .opblock {
        border-radius: 14px;
        border: 1px solid #1e293b;
        background: #020617;
        margin-bottom: 14px;
      }

      .swagger-ui .opblock-summary {
        font-weight: 600;
      }

      .swagger-ui .btn.execute {
        background-color: #3b82f6;
        border-color: #3b82f6;
      }

      .swagger-ui .btn.authorize {
        background-color: #22c55e;
        border-color: #22c55e;
      }

      .swagger-ui .responses-inner {
        border-radius: 10px;
      }

      .swagger-ui .scheme-container {
        background: #020617;
        border-radius: 12px;
        border: 1px solid #1e293b;
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

  // Redoc modern documentation
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