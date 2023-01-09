import axios from "axios";
import { getSession } from "next-auth/react";

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


