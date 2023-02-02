import { Injectable } from '@nestjs/common';

import { TagsRepository } from '../repositories/tags.repository';

@Injectable()
export class FindAllTagNamesFromUser {
  constructor(private tagsRepository: TagsRepository) {}

  async execute(authUserId: string) {
    return this.tagsRepository.findAllTagNamesFromUser(authUserId);
  }
}
