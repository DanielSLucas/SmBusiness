import axios from "axios";
import { getSession } from "next-auth/react";

import { createMovement } from "./routes/createMovement";
import { getSummarizedMovements } from "./routes/getSummarizedMovements";
import { listMovements } from "./routes/listMovements";

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

const api = setupApi();

export {
  api,
  createMovement,
  listMovements,
  getSummarizedMovements,  
}
