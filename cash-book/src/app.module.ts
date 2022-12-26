import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GoogleAuthGuard } from './auth/googleAuth.guard';
import { DatabaseModule } from './database/database.module';
import { MovementsModule } from './movements/movements.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MovementsModule,
    TagsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: GoogleAuthGuard }],
})
export class AppModule {}
