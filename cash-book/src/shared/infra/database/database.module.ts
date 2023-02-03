import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

import { TagsRepository } from '../../../modules/tags/repositories/tags.repository';
import { PrismaTagsRepository } from './prisma/repositories/tags.repository';

import { MovementsRepository } from '../../../modules/movements/repositories/movements.repository';
import { PrismaMovementsRepository } from './prisma/repositories/movements.repository';

import { MovementTagsRepository } from 'src/modules/movements/repositories/movement-tags.repository';
import { PrismaMovementTagsRepository } from './prisma/repositories/movement-tags.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: MovementsRepository,
      useClass: PrismaMovementsRepository,
    },
    {
      provide: TagsRepository,
      useClass: PrismaTagsRepository,
    },
    {
      provide: MovementTagsRepository,
      useClass: PrismaMovementTagsRepository,
    },
  ],
  exports: [
    PrismaService,
    MovementsRepository,
    TagsRepository,
    MovementTagsRepository,
  ],
})
export class DatabaseModule {}
