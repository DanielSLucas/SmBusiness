import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum MovementsGroupBy {
  MONTH_YEAR = 'month/year',
  TAGS = 'tags',
}

export class SummaryOptionsDto {
  @IsEnum(MovementsGroupBy)
  @IsNotEmpty()
  groupBy: MovementsGroupBy;

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
