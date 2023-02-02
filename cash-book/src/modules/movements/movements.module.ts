import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';

import { DatabaseModule } from '../../shared/infra/database/database.module';
import { MulterConfigService } from '../../shared/config/multer.config';

@Module({
  imports: [
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    DatabaseModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
