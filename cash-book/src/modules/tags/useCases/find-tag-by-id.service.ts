import { Injectable } from '@nestjs/common';

import { TagsRepository } from '../repositories/tags.repository';
import { TagNotFound } from './errors/tag-not-found';

@Injectable()
export class FindTagById {
  constructor(private tagsRepository: TagsRepository) {}

  async execute(tagId: string) {
    const tag = await this.tagsRepository.findOne(tagId);

    if (!tag) {
      throw new TagNotFound();
    }

    return tag;
  }
}
