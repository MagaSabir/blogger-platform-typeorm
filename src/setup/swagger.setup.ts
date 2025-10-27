import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Blogger Platform')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('Blog')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT Bearer token only',
      },
      'jwt',
    )
    .addCookieAuth('refreshToken')
    .addBasicAuth({ type: 'http', scheme: 'basic' }, 'basic')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Blogger Swagger',

    customCss: theme.getBuffer('dark' as any),
  });
}
