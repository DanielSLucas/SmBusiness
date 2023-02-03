import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MovementViewModel } from '../view-models/movement-view-model';

import {
  CreateMovementDto,
  CreateMovementsDto,
} from '../dtos/create-movement.dto';
import { UpdateMovementDto } from '../dtos/update-movement.dto';
import { AuthUser, CurrentUser } from '../../../auth/current-user';
import { FindAllMovementsDto } from '../dtos/find-all-movement.dto';
import { SummaryOptionsDto } from '../dtos/summary-options.dto';

import { CreateMovements } from '../../../../modules/movements/usecases/create-movements.service';
import { FindMovementById } from '../../../../modules/movements/usecases/find-movement-by-id.service';
import { UpdateMovement } from '../../../../modules/movements/usecases/update-movement.service';
import { DeleteMovement } from '../../../../modules/movements/usecases/delete-movement.service';
import { FindAllMovements } from '../../../../modules/movements/usecases/find-all-movements.service';
import { GetMovementsBalance } from '../../../../modules/movements/usecases/get-movements-balance.service';
import { GetMovementsSummay } from '../../../../modules/movements/usecases/get-movements-summary.service';
import { FindAllUniqueMovements } from '../../../../modules/movements/usecases/find-all-unique-movements.service';
import { ImportMovements } from '../../../../modules/movements/usecases/import-movements.service';
import { ExportMovements } from '../../../../modules/movements/usecases/export-movements.service';

@Controller('movements')
export class MovementsController {
  constructor(
    private readonly createMovements: CreateMovements,
    private readonly findMovementById: FindMovementById,
    private readonly findAllMovements: FindAllMovements,
    private readonly findAllUniqueMovements: FindAllUniqueMovements,
    private readonly updateMovement: UpdateMovement,
    private readonly deleteMovement: DeleteMovement,
    private readonly getMovementsBalance: GetMovementsBalance,
    private readonly getMovementsSummay: GetMovementsSummay,
    private readonly importMovements: ImportMovements,
    private readonly exportMovements: ExportMovements,
  ) {}

  @Get('names')
  async findAllUniqueNames(@CurrentUser() user: AuthUser) {
    const movements = await this.findAllUniqueMovements.execute(user.sub);

    return movements.map(MovementViewModel.toHTTP);
  }

  @Get('summary')
  summary(
    @CurrentUser() user: AuthUser,
    @Query() summaryOptions: SummaryOptionsDto,
  ) {
    return this.getMovementsSummay.execute(user.sub, summaryOptions);
  }

  @Get('balance')
  balance(
    @CurrentUser() user: AuthUser,
    @Query() searchOptions?: FindAllMovementsDto,
  ) {
    return this.getMovementsBalance.execute(user.sub, searchOptions);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    return this.importMovements.execute(user.sub, file);
  }

  @Post('export')
  exportFile(
    @CurrentUser() user: AuthUser,
    @Query() searchOptions?: FindAllMovementsDto,
  ) {
    return this.exportMovements.execute(user.sub, searchOptions);
  }

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createMovementDto: CreateMovementDto | CreateMovementsDto,
  ) {
    const createMovementsResponse = await this.createMovements.execute(
      user.sub,
      createMovementDto,
    );

    return Array.isArray(createMovementsResponse)
      ? createMovementsResponse.map(MovementViewModel.toHTTP)
      : MovementViewModel.toHTTP(createMovementsResponse);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movement = await this.findMovementById.execute(+id);

    return MovementViewModel.toHTTP(movement);
  }

  @Get()
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() searchOptions?: FindAllMovementsDto,
  ) {
    return this.findAllMovements.execute(user.sub, searchOptions);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    const movement = await this.updateMovement.execute(+id, updateMovementDto);
    return MovementViewModel.toHTTP(movement);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteMovement.execute(+id);
  }
}
