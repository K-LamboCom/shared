import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';

export default function setupSwagger(
  app: INestApplication<any>,
  port: number = 3000,
) {
  app.use(
    '/api-docs',
    basicAuth({
      challenge: true,
      users: { dev: 'dev@123' },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Dash Stack API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer(`https://localhost:${port}/`, 'localhost')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`,
  });

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
