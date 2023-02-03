import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../shared/infra/database/database.module';

import { CreateMovements } from './usecases/create-movements.service';
import { FindMovementById } from './usecases/find-movement-by-id.service';
import { UpdateMovement } from './usecases/update-movement.service';
import { DeleteMovement } from './usecases/delete-movement.service';
import { FindAllMovements } from './usecases/find-all-movements.service';
import { GetMovementsBalance } from './usecases/get-movements-balance.service';
import { GetMovementsSummay } from './usecases/get-movements-summary.service';
import { FindAllUniqueMovements } from './usecases/find-all-unique-movements.service';
import { ImportMovements } from './usecases/import-movements.service';
import { ExportMovements } from './usecases/export-movements.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateMovements,
    FindMovementById,
    FindAllMovements,
    FindAllUniqueMovements,
    UpdateMovement,
    DeleteMovement,
    GetMovementsBalance,
    GetMovementsSummay,
    ImportMovements,
    ExportMovements,
  ],
  exports: [
    CreateMovements,
    FindMovementById,
    FindAllMovements,
    FindAllUniqueMovements,
    UpdateMovement,
    DeleteMovement,
    GetMovementsBalance,
    GetMovementsSummay,
    ImportMovements,
    ExportMovements,
  ],
})
export class MovementsModule {}
