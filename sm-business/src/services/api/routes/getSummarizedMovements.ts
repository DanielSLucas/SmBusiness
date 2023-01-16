import { api } from "..";
import { toBRL } from "../../../utils/toBRL";
import { formatted } from "../../../utils";
import { Filters } from "./listMovements";

export interface MovementsSummaryParams extends Filters {
  groupBy: 'day' | 'month' | 'year' | 'tags';
}

interface MovementSummaryItem {  
  group: string;
  income: string;
  outcome: string;
  total: string;
}

export function getSummarizedMovements (params: MovementsSummaryParams) {
  return async () => {
    const { data } = await api.get<MovementSummaryItem[]>('/movements/summary', { params });

    return data.map(summaryItem => ({
      id: summaryItem.group,
      group: formatted(summaryItem.group),
      income: toBRL(summaryItem.income),
      outcome: toBRL(summaryItem.outcome),
      total: toBRL(summaryItem.total),
    }))
  }
}
