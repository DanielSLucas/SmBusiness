import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast 
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

import { queryClient } from "../services/queryClient";
import { createMovement } from "../services/api";
import { MovementForm, MovementFormData } from "./MovementForm";
import { useGlobalDisclosure } from "../hooks/useGlobalDisclosure";

export const NewMovementModal: React.FC = () => {
  const { isOpen, onClose } = useGlobalDisclosure("newMovementModal");
  
  const router = useRouter();
  const toast = useToast();

  const { mutateAsync } = useMutation(createMovement, {
    onSuccess: () => {
      queryClient.invalidateQueries('movements')
    }
  })

  const handleNewMovementFormSubmit = async (data: MovementFormData) => {
    try {
      await mutateAsync(data)

      toast({
        title: "Movimento de caixa criado com sucesso!",
        duration: 2500,
        position: "top",
        status: "success"
      });
        
      onClose();
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
          title: "Erro ao criar movimento de caixa.",
          description: (error as Error).message,              
          status: "error",
          position: "top",
          isClosable: true
        });
      }      
    }
  }  

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent display="flex" justifyContent="flex-end">
        <ModalHeader>Nova movimentação</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          <MovementForm 
            onSubmit={handleNewMovementFormSubmit}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
