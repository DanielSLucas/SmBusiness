import { Injectable } from '@nestjs/common';

import { FindAllMovementsDto } from '../../../shared/infra/http/dtos/find-all-movement.dto';
import { MovementsRepository } from '../repositories/movements.repository';

@Injectable()
export class GetMovementsBalance {
  constructor(private movementsRepository: MovementsRepository) {}

  async execute(authUserId: string, filters: FindAllMovementsDto) {
    return this.movementsRepository.balance(authUserId, filters);
  }
}
