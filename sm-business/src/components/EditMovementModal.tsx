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
import { updateMovement } from "../services/api";
import { MovementForm, MovementFormData } from "./MovementForm";
import { Movement } from "../pages";

interface EditMovementModalProps {
  movement: Movement;
  isOpen: boolean;
  onClose: () => void;
}

export const EditMovementModal: React.FC<EditMovementModalProps> = ({
  movement,
  isOpen,
  onClose,
}) => {  
  const router = useRouter();
  const toast = useToast();  

  const { mutateAsync } = useMutation(updateMovement, {
    onSuccess: () => {
      queryClient.invalidateQueries('movements')
    }
  })

  const handleNewMovementFormSubmit = async (data: MovementFormData) => {
    try {
      await mutateAsync({
        id: movement.id,
        data,
      })

      toast({
        title: "Movimento de caixa editado com sucesso!",
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
          title: "Erro ao editar movimento de caixa.",
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
            defaultValues={{
              ...movement,
              amount: Number(movement.amount),
              tags: movement.tags.join(';'),
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
