import { api } from "..";

type MovementColumns = 'id' | 'date' | 'description' | 'amount' | 'type';

export interface Filters {
  orderBy?: MovementColumns;
  order?: 'asc' | 'desc';
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  tags?: string;
  distinct?: MovementColumns;
  page?: number;
  perPage?: number;
}

export interface Movement {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string[]
}

export interface ListMovementsResponse {
  pagination: {
    isPaginated: boolean,
		hasPrev?: boolean,
		hasNext?: boolean,
		totalCount: number
  }
  data: Movement[];
}

export function listMovements (filters: Filters) {
  return async () => (
    await api.get<ListMovementsResponse>('/movements', { params: filters })
  ).data
}
