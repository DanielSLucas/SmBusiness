import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [DatabaseModule, TagsModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
