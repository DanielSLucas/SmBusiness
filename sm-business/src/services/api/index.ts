import axios from "axios";
import { getSession } from "next-auth/react";

import { createMovement } from "./routes/createMovement";
import { getBalance } from "./routes/getBalance";
import { getSummarizedMovements } from "./routes/getSummarizedMovements";
import { getTags } from "./routes/getTags";
import { listMovements } from "./routes/listMovements";

function setupApi() {
  const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,    
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

const api = setupApi();

export {
  api,
  createMovement,
  listMovements,
  getSummarizedMovements,  
  getTags,
  getBalance
}
