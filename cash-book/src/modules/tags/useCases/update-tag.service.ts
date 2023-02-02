import { Injectable } from '@nestjs/common';

import { Tag } from '../entities/tag.entity';
import { TagsRepository } from '../repositories/tags.repository';
import { TagNotFound } from './errors/tag-not-found';

@Injectable()
export class UpdateTag {
  constructor(private tagsRepository: TagsRepository) {}

  async execute(tagId: string, name: string) {
    const tagExists = await this.tagsRepository.findOne(tagId);

    if (!tagExists) {
      throw new TagNotFound();
    }

    return this.tagsRepository.update(tagId, new Tag({ name }).name);
  }
}
