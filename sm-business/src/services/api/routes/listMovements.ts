import { api } from "..";

export interface Filters {
  orderBy?: 'id' | 'date' | 'description' | 'amount' | 'type';
  order?: 'asc' | 'desc';
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  tags?: string;
  distinct?: string;
}

export interface Movement {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: 'INCOME' | 'OUTCOME';
  tags: {
    tag: {
      id: string;
      name: string;
    }
  }[]
}

export function listMovements (filters: Filters) {
  return async () => (
    await api.get<Movement[]>('/movements', { params: filters })
  ).data
}
