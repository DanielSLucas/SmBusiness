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

export enum OrderBy {
  ID = 'id',
  DATE = 'date',
  DESCRIPTION = 'description',
  AMOUNT = 'amount',
  TYPE = 'type',
  AUTHUSERID = 'authuserid',
  REFID = 'refid',
  CREATEDAT = 'createdat',
  UPDATEDAT = 'updatedat',
}

export class FindAllMovementsDto {
  @IsEnum(OrderBy)
  @IsOptional()
  orderBy: OrderBy;

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
}
