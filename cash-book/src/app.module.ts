import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { GoogleAuthGuard } from './shared/auth/googleAuth.guard';
import { DatabaseModule } from './shared/infra/database/database.module';
import { MovementsModule } from './modules/movements/movements.module';
import { HttpModule } from './shared/infra/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MovementsModule,
    HttpModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: GoogleAuthGuard }],
})
export class AppModule {}
