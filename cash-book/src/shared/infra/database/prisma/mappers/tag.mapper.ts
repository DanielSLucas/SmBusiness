import { Tag as RawTag } from '@prisma/client';

import { Tag } from '../../../../../modules/tags/entities/tag.entity';

export class PrismaTagMapper {
  static toPrisma(tag: Tag) {
    return {
      name: tag.name,
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
