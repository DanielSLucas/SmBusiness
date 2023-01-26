import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { tempFolder } from './config/multer.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  JSON.stringify(
    this,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );

  app.useStaticAssets(tempFolder, { prefix: '/files/' });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3333);
}
bootstrap();
