import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useApiErrorToasts(error?: unknown) {
  const toast = useToast();
  const router = useRouter();  

  useEffect(() => {
    if (error) {
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
      };
    }
  }, [error, router, toast]);  
}