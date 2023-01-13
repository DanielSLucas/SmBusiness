import { api } from "..";

export interface NewMovementData {
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string;
}

export async function createMovement(data: NewMovementData): Promise<void> {
  const newMovementData = {
    ...data,
    tags: data.tags.split(';')
  };

  await api.post('/movements', newMovementData);
}
