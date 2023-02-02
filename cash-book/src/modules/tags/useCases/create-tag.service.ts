import { Injectable } from '@nestjs/common';

import { Tag } from '../entities/tag.entity';
import { TagsRepository } from '../repositories/tags.repository';
import { TagAlreadyExists } from './errors/tag-already-exists';

@Injectable()
export class CreateTag {
  constructor(private tagsRepository: TagsRepository) {}

  async execute(name: string) {
    const tag = new Tag({ name });

    const tagExists = await this.tagsRepository.findOneByName(tag.name);

    if (tagExists) {
      throw new TagAlreadyExists();
    }

    return this.tagsRepository.create(tag.name);
  }
}
