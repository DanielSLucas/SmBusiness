import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useFetch<T>(path: string, params?: Record<string, any>): {isLoading: boolean, data: T | null} {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    (async function getData() {
      try {
        setIsLoading(true);
        const response = await api.get<T>(path, {
          params,
        });
  
        setData(response.data);
      } catch (error) {          
        if ((error as AxiosError).response?.status === 401) {
          toast({
            title: "Sessão expirada!",
            description: "Redirecionando para página de login...",
            duration: 2500,
            position: "top",
            status: "warning"
          });

          setTimeout(() => {
            router.push('/signin')
          }, 3000);
        } else {
          console.log(error);

          toast({
            title: "Erro ao buscar dados",
            description: (error as Error).message,              
            status: "error",
            position: "top",
            isClosable: true
          });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params, path, router, toast]);

  return { isLoading, data };
}