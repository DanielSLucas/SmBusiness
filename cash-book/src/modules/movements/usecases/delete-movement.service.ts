import { Injectable } from '@nestjs/common';

import { TagsRepository } from '../../tags/repositories/tags.repository';
import { MovementTagsRepository } from '../repositories/movement-tags.repository';
import { MovementsRepository } from '../repositories/movements.repository';
import { MovementNotFound } from './errors/movement-not-found';

@Injectable()
export class DeleteMovement {
  constructor(
    private movementsRepository: MovementsRepository,
    private tagsRespository: TagsRepository,
    private movementTagsRepository: MovementTagsRepository,
  ) {}

  async execute(movementId: number) {
    const movement = await this.movementsRepository.findOne(movementId);

    if (!movement) {
      throw new MovementNotFound();
    }

    const movementTagsIds = movement.tags.map((tag) => tag.id);

    const movementsWithSameTags =
      await this.movementTagsRepository.findManyByTagIds(movementTagsIds);

    if (!movementsWithSameTags.length) {
      await Promise.all(
        movementTagsIds.map((tagId) => this.tagsRespository.remove(tagId)),
      );
    }

    await this.movementTagsRepository.deleteManyByMovementId(movement.id);

    await this.movementsRepository.remove(movement.id);
  }
}
