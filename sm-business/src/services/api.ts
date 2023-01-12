import axios from "axios";
import { getSession } from "next-auth/react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { FiltersData } from "../components/Filters";
import { NewMovementFormData } from "../components/NewMovementModal";
import { Movement } from "../pages";
import { toBRL } from "../utils/toBRL";
import { toLocaleMonthYearString } from "../utils/toLocaleMonthYearString";

function setupApi() {
  const apiInstance = axios.create({
    baseURL: 'http://localhost:3333',    
  });

  apiInstance.interceptors.request.use(async (request) => {
    const session = await getSession();
    
    if (session) {
      request.headers = {
        Authorization: `Bearer ${session.accessToken}`,
      };
    }

    return request;
  });

  return apiInstance;
}

export const api = setupApi();


export async function createMovement(data: NewMovementFormData): Promise<void> {
  const newMovementData = {
    ...data,
    tags: data.tags.split(';')
  };

  await api.post('/movements', newMovementData);
}

export function listMovements (filters: FiltersData) {
  return async () => (await api.get<Movement[]>('/movements', { params: filters })).data
}

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
