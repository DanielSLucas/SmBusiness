import { api } from "..";

export interface MovementData {
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string;
}

type UpdateMovementPayload = {
  id: number, 
  data: MovementData
}

export async function updateMovement({ id, data }: UpdateMovementPayload): Promise<void> {
  const movementData = {
    ...data,
    tags: data.tags.split(';')
  };

  await api.put(`/movements/${id}`, movementData);
}
