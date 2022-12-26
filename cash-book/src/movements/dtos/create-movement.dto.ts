import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MovementType } from '../entities/movement.entity';

export class CreateMovementDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsEnum(MovementType)
  @IsNotEmpty()
  type: MovementType;

  @IsOptional()
  @IsString()
  refId?: string;

  @IsNotEmpty()
  @IsArray()
  tags: string[];
}

export class CreateMovementsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateMovementDto)
  movements: CreateMovementDto[];
}
