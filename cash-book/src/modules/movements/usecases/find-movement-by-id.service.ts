import { Injectable } from '@nestjs/common';

import { MovementsRepository } from '../repositories/movements.repository';
import { MovementNotFound } from './errors/movement-not-found';

@Injectable()
export class FindMovementById {
  constructor(private movementsRepository: MovementsRepository) {}

  async execute(movementId: number) {
    const movement = await this.movementsRepository.findOne(movementId);

    if (!movement) {
      throw new MovementNotFound();
    }

    return movement;
  }
}
