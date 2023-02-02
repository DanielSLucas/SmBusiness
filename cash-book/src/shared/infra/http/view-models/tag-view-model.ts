import { Tag } from '../../../../modules/tags/entities/tag.entity';

export class TagViewModel {
  static toHTTP(tag: Tag) {
    return {
      id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }
}
