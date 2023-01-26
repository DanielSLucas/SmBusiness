import { api } from "..";

type MovementColumns = 'id' | 'date' | 'description' | 'amount' | 'type';

export interface ExportMovementsFilters {
  orderBy?: MovementColumns;
  order?: 'asc' | 'desc';
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  tags?: string;
  distinct?: MovementColumns;
}

export interface ExportMovementsResponse {
  fileName: string;
	downloadPath: string;
	expiresAt: string;
}

export async function exportMovements(filters: ExportMovementsFilters) {
  const response = await api.post<ExportMovementsResponse>('/movements/export', undefined, {
    params: filters
  });

  return response.data;
}
