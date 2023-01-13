import { api } from "..";
import { toBRL } from "../../../utils/toBRL";
import { toLocaleMonthYearString } from "../../../utils/toLocaleMonthYearString";

export interface MovementsSummaryParams {
  groupBy: 'month' | 'tags';
  description?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  tags?: string;
}

interface MovementSummaryItem {  
  income: string;
  outcome: string;
  total: string;
}

interface MovementPerMonthSummaryItem extends MovementSummaryItem {
  month: string;
}

interface MovementPerTagSummaryItem extends MovementSummaryItem {    
  tag: string;
}

type MovementsSummaryResponse = MovementPerMonthSummaryItem[] | MovementPerTagSummaryItem[];

export function getSummarizedMovements (params: MovementsSummaryParams) {
  return async () => {
    const { data } = await api.get<MovementsSummaryResponse>('/movements/summary', { params });

    return data.map(summaryItem => {
      if (Reflect.has(summaryItem, 'month')) {
        const item = summaryItem as MovementPerMonthSummaryItem;
        
        return {
          id: item.month,
          month: toLocaleMonthYearString(item.month),
          income: toBRL(item.income),
          outcome: toBRL(item.outcome),
          total: toBRL(item.total),
        }
      } else {
        const item = summaryItem as MovementPerTagSummaryItem;
        
        return {
          id: item.tag,
          tag: item.tag,
          income: toBRL(item.income),
          outcome: toBRL(item.outcome),
          total: toBRL(item.total),
        }
      }
    })
  }
}
