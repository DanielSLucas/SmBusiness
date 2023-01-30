import { api } from "..";

interface Movement {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string[]
}

export async function getMovementsNames() {
  return (await api.get<Movement[]>('/movements/names')).data;
}
