import { Injectable } from '@nestjs/common';

import {
  CreateMovementDto,
  CreateMovementsDto,
} from '../../../shared/infra/http/dtos/create-movement.dto';

import { Tag } from '../../tags/entities/tag.entity';
import { TagsRepository } from '../../tags/repositories/tags.repository';

import { Movement } from '../entities/movement.entity';
import { MovementsRepository } from '../repositories/movements.repository';

@Injectable()
export class CreateMovements {
  constructor(
    private movementsRepository: MovementsRepository,
    private tagsRepository: TagsRepository,
  ) {}

  async execute(
    authUserId: string,
    data: CreateMovementDto | CreateMovementsDto,
  ) {
    if (!Reflect.has(data, 'movements') || data instanceof CreateMovementDto) {
      const movementData = data as CreateMovementDto;

      const tags = movementData.tags.map(
        (tagName) => new Tag({ name: tagName }),
      );
      const upsertedTags = await Promise.all(
        tags.map((tag) => this.tagsRepository.upsert(tag.name)),
      );

      const movement = new Movement({
        ...movementData,
        authUserId,
        tags: upsertedTags,
      });

      return this.movementsRepository.create(movement);
    } else {
      const { movements: movementsData } = data as CreateMovementsDto;

      const movementsTags = movementsData.map((mv) =>
        mv.tags.map((tagName) => new Tag({ name: tagName })),
      );
      const upsertedMovementsTags = await Promise.all(
        movementsTags.map((mvTags) =>
          Promise.all(
            mvTags.map((tag) => this.tagsRepository.upsert(tag.name)),
          ),
        ),
      );

      const movements = movementsData.map(
        (mvData, i) =>
          new Movement({
            ...mvData,
            authUserId,
            tags: upsertedMovementsTags[i],
          }),
      );

      return this.movementsRepository.createMany(movements);
    }
  }
}
