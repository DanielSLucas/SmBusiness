import { Injectable } from '@nestjs/common';

import { TagsRepository } from '../repositories/tags.repository';

@Injectable()
export class FindAllTags {
  constructor(private tagsRepository: TagsRepository) {}

  async execute() {
    return this.tagsRepository.findAll();
  }
}
