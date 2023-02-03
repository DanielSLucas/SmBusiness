import {
  Movement,
  MovementType,
} from '../../../../modules/movements/entities/movement.entity';

export interface HttpMovement {
  id: number;
  date: Date;
  description: string;
  amount: number;
  type: MovementType;
  tags: string[];
}

export class MovementViewModel {
  static toHTTP(movement: Movement): HttpMovement {
    return {
      id: movement.id,
      date: movement.date,
      description: movement.description,
      amount: movement.amount,
      type: movement.type,
      tags: movement.tags.map((tag) => tag.name),
    };
  }
}
