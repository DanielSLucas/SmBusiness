import { Module } from '@nestjs/common';

import { TagsController } from './controllers/tags.controller';

import { TagsModule } from '../../../modules/tags/tags.module';

@Module({
  imports: [TagsModule],
  controllers: [TagsController],
})
export class HttpModule {}
