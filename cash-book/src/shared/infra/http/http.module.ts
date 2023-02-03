import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MulterConfigService } from '../../../shared/config/multer.config';

import { MovementsModule } from 'src/modules/movements/movements.module';
import { MovementsController } from './controllers/movements.controller';
import { TagsModule } from '../../../modules/tags/tags.module';
import { TagsController } from './controllers/tags.controller';

@Module({
  imports: [
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    MovementsModule,
    TagsModule,
  ],
  controllers: [MovementsController, TagsController],
})
export class HttpModule {}
