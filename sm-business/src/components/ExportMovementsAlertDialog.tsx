import { useRef, useState } from "react";
import { 
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

import { Filters } from "../services/api/routes/listMovements";
import { exportMovements } from "../services/api/routes/exportMovements";
import { useGlobalDisclosure } from "../hooks/useGlobalDisclosure";

interface ExportMovementsAlertDialogProps {
  filters: Partial<Filters>
}

export const ExportMovementsAlertDialog: React.FC<ExportMovementsAlertDialogProps> = ({
  filters
}) => {
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onClose } = useGlobalDisclosure("exportMovementsAlertDialog");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isExportingWithFilters, setIsExportingWithFilters] = useState(false);
  const [isExportingWithoutFilters, setIsExportingWithoutFilters] = useState(false);

  const { mutateAsync, isLoading } = useMutation(exportMovements);

  async function handleExport (withFilters: boolean) {
    try {
      withFilters ? setIsExportingWithFilters(true) : setIsExportingWithoutFilters(true);
      const response = await mutateAsync(withFilters ? filters : {});
    
      const downloadAnchor = document.createElement('a');
      
      downloadAnchor.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.downloadPath}`;
      downloadAnchor.download = response.fileName;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      toast({
        title: "Movimentos de caixa exportados com sucesso!",
        duration: 2500,
        position: "top",
        status: "success"
      });      
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
          title: "Erro ao importar movimentos de caixa.",
          description: (error as Error).message,              
          status: "error",
          position: "top",
          isClosable: true
        });
      }
    } finally {
      withFilters ? setIsExportingWithFilters(false) : setIsExportingWithoutFilters(false);
      onClose();
    }
  }

  return (
    <AlertDialog      
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Exportar tudo?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Exportar movimentações com os filtros aplicados ou exportar tudo?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button 
            ref={cancelRef} 
            onClick={() => handleExport(false)}
            disabled={isLoading}
            isLoading={isExportingWithoutFilters}
          >
            Exportar tudo
          </Button>
          <Button 
            colorScheme='blue' 
            ml={3} 
            onClick={() => handleExport(true)}
            disabled={isLoading}
            isLoading={isExportingWithFilters}
          >
            Exportar com filtros aplicados
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
