import { Tag } from '../entities/tag.entity';

export abstract class TagsRepository {
  abstract create(name: string): Promise<Tag>;
  abstract findAll(): Promise<Tag[]>;
  abstract findAllTagNamesFromUser(
    authUserId: string,
  ): Promise<{ id: string; name: string }[]>;
  abstract findOne(id: string): Promise<Tag | null>;
  abstract findOneByName(name: string): Promise<Tag | null>;
  abstract upsert(name: string): Promise<Tag>;
  abstract update(id: string, name: string): Promise<Tag>;
  abstract remove(id: string): Promise<Tag>;
}
