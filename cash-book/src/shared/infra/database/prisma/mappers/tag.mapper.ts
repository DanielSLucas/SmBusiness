import { Tag as RawTag } from '@prisma/client';

import { Tag } from '../../../../../modules/tags/entities/tag.entity';

export class PrismaTagMapper {
  static toPrisma(tag: Partial<Tag>) {
    return {
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  static toDomain(raw: RawTag): Tag {
    return new Tag(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
