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
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import {
  CreateMovementDto,
  CreateMovementsDto,
} from './dtos/create-movement.dto';
import { UpdateMovementDto } from './dtos/update-movement.dto';
import { AuthUser, CurrentUser } from 'src/shared/auth/current-user';
import { FindAllMovementsDto } from './dtos/find-all-movement.dto';
import { SummaryOptionsDto } from './dtos/summary-options.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  importFile(
    @UploadedFile()
    file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    return this.movementsService.import(user.sub, file);
  }

  @Post('/export')
  exportFile(
    @CurrentUser() user: AuthUser,
    @Query() searchOptions?: FindAllMovementsDto,
  ) {
    return this.movementsService.export(user.sub, searchOptions);
  }

  @Get('summary')
  summary(
    @CurrentUser() user: AuthUser,
    @Query() summaryOptions: SummaryOptionsDto,
  ) {
    return this.movementsService.summary(user.sub, summaryOptions);
  }

  @Get('balance')
  balance(
    @CurrentUser() user: AuthUser,
    @Query() searchOptions?: FindAllMovementsDto,
  ) {
    return this.movementsService.balance(user.sub, searchOptions);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() searchOptions?: FindAllMovementsDto,
  ) {
    return this.movementsService.find(user.sub, searchOptions);
  }

  @Get('/names')
  findAllUniqueNames(@CurrentUser() user: AuthUser) {
    return this.movementsService.findAllMovementNamesFromUser(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(+id);
  }

  @Put(':id')
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