import { Prisma, Movement as RawMovement, Tag as RawTag } from '@prisma/client';

import {
  Movement,
  MovementType,
} from '../../../../../modules/movements/entities/movement.entity';
import { PrismaTagMapper } from './tag.mapper';

export class PrismaMovementMapper {
  static toPrisma(movement: Partial<Movement>) {
    return {
      date: movement.date,
      description: movement.description,
      amount: movement.amount ? new Prisma.Decimal(movement.amount) : undefined,
      type: movement.type,
      authUserId: movement.authUserId,
      refId: movement.refId,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
    };
  }

  static toDomain(raw: RawMovement, rawTags: RawTag[]): Movement {
    return new Movement(
      {
        date: raw.date,
        description: raw.description,
        amount: Number(raw.amount),
        type: raw.type as MovementType,
        authUserId: raw.authUserId,
        refId: raw.refId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        tags: rawTags.map(PrismaTagMapper.toDomain),
      },
      raw.id,
    );
  }
}
