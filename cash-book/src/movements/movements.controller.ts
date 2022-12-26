import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import {
  CreateMovementDto,
  CreateMovementsDto,
} from './dtos/create-movement.dto';
import { UpdateMovementDto } from './dtos/update-movement.dto';
import { AuthUser, CurrentUser } from 'src/auth/current-user';
import { FindAllMovementsDto } from './dtos/find-all-movement.dto';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(
    @Body() createMovementDto: CreateMovementDto | CreateMovementsDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.movementsService.create(user.sub, createMovementDto);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthUser) {
    return this.movementsService.summary(user.sub);
  }

  @Get('balance')
  balance(@CurrentUser() user: AuthUser) {
    return this.movementsService.balance(user.sub);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() searchOptions?: FindAllMovementsDto,
  ) {
    return this.movementsService.findAll(user.sub, searchOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    return this.movementsService.update(+id, updateMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementsService.remove(+id);
  }
}
