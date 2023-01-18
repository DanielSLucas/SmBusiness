import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TagsModule } from 'src/tags/tags.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/config/multer.config';

@Module({
  imports: [
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    DatabaseModule,
    TagsModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
