import { HttpMovement } from '../../../shared/infra/http/view-models/movement-view-model';
import { Movement } from '../entities/movement.entity';

export abstract class MovementsRepository {
  abstract create(movement: Movement): Promise<Movement>;
  abstract createMany(movements: Movement[]): Promise<Movement[]>;
  abstract findAll(
    authUserId: string,
    filters?: Partial<Filters>,
  ): Promise<FindAllReturn>;
  abstract findOne(id: number): Promise<Movement | null>;
  abstract findAllUniqueMovements(authUserId: string): Promise<Movement[]>;
  abstract update(id: number, data: Partial<Movement>): Promise<Movement>;
  abstract remove(id: number): Promise<Movement>;
  abstract balance(
    authUserId: string,
    filters?: Partial<Filters>,
  ): Promise<Balance>;
  abstract summary(
    authUserId: string,
    filters?: SummaryFilters,
  ): Promise<SummaryItem[]>;
  abstract maxTagsPerMovement(authUserId: string): Promise<number>;
}

export interface FindAllReturn {
  pagination: {
    totalCount: number;
    isPaginated: boolean;
    hasPrev?: boolean;
    hasNext?: boolean;
  };
  data: HttpMovement[];
}

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

export interface Filters {
  orderBy: MovementColumns;
  order: Order;
  page: number;
  perPage: number;
  date: Date;
  startDate: Date;
  endDate: Date;
  description: string;
  tags: string;
  distinct: MovementColumns;
}

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

export enum MovementsGroupBy {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
  TAGS = 'tags',
}

export class SummaryFilters {
  groupBy: MovementsGroupBy;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  tags?: string;
}

export interface SummaryItem {
  group: string;
  income: string;
  outcome: string;
  total: string;
}
