import { api } from "..";

type MovementColumns = 'id' | 'date' | 'description' | 'amount' | 'type';

export interface GetBalanceFilters {  
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  tags?: string;
  distinct?: MovementColumns;
}

export interface Balance {
  income: string;
  outcome: string;
  total: string
}

export function getBalance (filters: GetBalanceFilters) {
  return async () => (
    await api.get<Balance>('/movements/balance', { params: filters })
  ).data
}
