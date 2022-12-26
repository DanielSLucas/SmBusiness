export enum MovementType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

export class Movement {
  id: number;
  date: Date;
  description: string;
  amount: number;
  type: MovementType;
  authUserId: string;
  refId?: string;
  createdAt: Date;
  updatedAt: Date;
}
