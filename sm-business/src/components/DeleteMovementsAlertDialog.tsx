import { useRef } from "react";
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

import { deleteMovement } from "../services/api/";
import { Movement } from "../pages";

interface DeleteMovementAlertDialogProps {
  movement: Movement;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteMovementAlertDialog: React.FC<DeleteMovementAlertDialogProps> = ({
  movement,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync } = useMutation(deleteMovement);

  async function handleDelete (id: number) {
    try {
      await mutateAsync(id);

      toast({
        title: "Movimento excluído com sucesso!",
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
          title: "Erro ao excluir movimento de caixa.",
          description: (error as Error).message,              
          status: "error",
          position: "top",
          isClosable: true
        });
      }
    } finally {
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
        <AlertDialogHeader>Excluir Movimentação</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Tem certeza que deseja excluir o movimento de caixa:{'\n'}
          {`"${movement.description}"`} ?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button colorScheme='red' ml={3} onClick={() => handleDelete(movement.id)}>
            Exluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
