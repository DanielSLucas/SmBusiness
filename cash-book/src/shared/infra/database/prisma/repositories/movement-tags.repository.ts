import { Injectable } from '@nestjs/common';

import {
  MovementTag,
  MovementTagsRepository,
} from '../../../../../modules/movements/repositories/movement-tags.repository';
import { PrismaMovementMapper } from '../mappers/movement.mapper';
import { PrismaTagMapper } from '../mappers/tag.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMovementTagsRepository implements MovementTagsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByTagIds(tagIds: string[]): Promise<MovementTag[]> {
    const movementTags = await this.prisma.movementTag.findMany({
      where: {
        tagId: {
          in: tagIds,
        },
      },
      include: {
        movement: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
        tag: true,
      },
    });

    return movementTags.map((mvTg) => ({
      id: mvTg.id,
      movement: PrismaMovementMapper.toDomain(
        mvTg.movement,
        mvTg.movement.tags.map((tgs) => tgs.tag),
      ),
      tag: PrismaTagMapper.toDomain(mvTg.tag),
    }));
  }

  async deleteManyByMovementId(movementId: number): Promise<void> {
    await this.prisma.movementTag.deleteMany({
      where: {
        movementId,
      },
    });
  }
}
