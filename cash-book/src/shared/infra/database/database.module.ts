import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { PrismaTagsRepository } from './prisma/repositories/tags.repository';

import { TagsRepository } from '../../../modules/tags/repositories/tags.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: TagsRepository,
      useClass: PrismaTagsRepository,
    },
  ],
  exports: [PrismaService, TagsRepository],
})
export class DatabaseModule {}
