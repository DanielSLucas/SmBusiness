import { Injectable } from '@nestjs/common';

import { UpdateMovementDto } from '../../../shared/infra/http/dtos/update-movement.dto';

import { Tag } from '../../tags/entities/tag.entity';
import { TagsRepository } from '../../tags/repositories/tags.repository';
import { MovementsRepository } from '../repositories/movements.repository';
import { MovementNotFound } from './errors/movement-not-found';

@Injectable()
export class UpdateMovement {
  constructor(
    private movementsRepository: MovementsRepository,
    private tagsRepository: TagsRepository,
  ) {}

  async execute(movementId: number, data: UpdateMovementDto) {
    const movementExists = await this.movementsRepository.findOne(movementId);

    if (!movementExists) {
      throw new MovementNotFound();
    }

    if (data.amount) {
      movementExists.amount = data.amount;
    }

    if (data.date) {
      movementExists.date = data.date;
    }

    if (data.description) {
      movementExists.description = data.description;
    }

    if (data.type) {
      movementExists.type = data.type;
    }

    if (data.tags?.length) {
      const tags = data.tags.map((tagName) => new Tag({ name: tagName }));
      const upsertedTags = await Promise.all(
        tags.map((tag) => this.tagsRepository.upsert(tag.name)),
      );
      movementExists.tags = upsertedTags;
    }

    if (data.refId) {
      movementExists.refId = data.refId;
    }

    return this.movementsRepository.update(movementId, movementExists);
  }
}
