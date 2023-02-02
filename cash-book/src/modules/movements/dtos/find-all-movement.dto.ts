import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export enum MovementColumns {
  ID = 'id',
  DATE = 'date',
  DESCRIPTION = 'description',
  AMOUNT = 'amount',
  TYPE = 'type',
}

export class FindAllMovementsDto {
  @IsEnum(MovementColumns)
  @IsOptional()
  orderBy: MovementColumns;

  @IsOptional()
  @IsEnum(Order)
  order: Order;

  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  perPage: number;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  tags: string;

  @IsString()
  @IsOptional()
  distinct: MovementColumns;
}
