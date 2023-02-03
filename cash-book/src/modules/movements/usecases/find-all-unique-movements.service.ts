import { Injectable } from '@nestjs/common';

import { MovementsRepository } from '../repositories/movements.repository';

@Injectable()
export class FindAllUniqueMovements {
  constructor(private movementsRepository: MovementsRepository) {}

  async execute(authUserId: string) {
    return this.movementsRepository.findAllUniqueMovements(authUserId);
  }
}
