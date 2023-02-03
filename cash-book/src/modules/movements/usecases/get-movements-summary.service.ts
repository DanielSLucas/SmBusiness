import { Injectable } from '@nestjs/common';

import { SummaryOptionsDto } from '../../../shared/infra/http/dtos/summary-options.dto';
import { MovementsRepository } from '../repositories/movements.repository';

@Injectable()
export class GetMovementsSummay {
  constructor(private movementsRepository: MovementsRepository) {}

  async execute(authUserId: string, filters: SummaryOptionsDto) {
    return this.movementsRepository.summary(authUserId, filters);
  }
}
