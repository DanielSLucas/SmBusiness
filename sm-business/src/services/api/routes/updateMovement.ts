import { api } from "..";

export interface MovementData {
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string;
}

export async function updateMovement(id: number, data: MovementData): Promise<void> {
  const movementData = {
    ...data,
    tags: data.tags.split(';')
  };

  await api.put(`/movements/${id}`, movementData);
}
