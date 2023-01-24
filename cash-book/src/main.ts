import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  JSON.stringify(
    this,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3333);
}
bootstrap();
