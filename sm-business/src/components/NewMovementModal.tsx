import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Button, ModalFooter, useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../services/api";
import { Input } from "./Inputs/Input";
import { Select } from "./Inputs/Select";
import { Tag, TagInput } from "./Inputs/TagInput";

interface NewMovementModalProps {
  onClose: () => void;
  isOpen: boolean;
  tags: Tag[];
  addTag: (tagName: string) => void;
}

interface NewMovementFormData {
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string;
}

export const NewMovementModal: React.FC<NewMovementModalProps> = ({
  onClose,
  isOpen,
  tags,
  addTag,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { register, handleSubmit, reset, setValue, control } = useForm<NewMovementFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const handleNewMovementFormSubmit: SubmitHandler<NewMovementFormData> = async (data) => {    
    const newMovementData = {
      ...data,
      tags: data.tags.split(';')
    }

    try {
      setIsLoading(true);
      await api.post('/movements', newMovementData);

      toast({
        title: "Movimento de caixa criado com sucesso!",
        duration: 2500,
        position: "top",
        status: "success"
      });
  
      reset();
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent display="flex" justifyContent="flex-end">
        <ModalHeader>Nova movimentação</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          <Flex as="form" direction="column" gap="2" onSubmit={handleSubmit(handleNewMovementFormSubmit)}>
            <Input 
              label="Descrição"
              placeholder="Descrição"
              name="description"
              register={register}        
            />

            <Input 
              label="Valor"
              placeholder="Valor"
              name="amount"
              type="number"
              step="0.01"
              register={register}        
            />

            <Input 
              label="Data"
              placeholder="Data"
              name="date"
              type="date"
              register={register}        
            />

            <Select
              label="Tipo"
              placeholder='Entrada/Saída'
              name="type"
              register={register}
            >
              <option value='INCOME'>Entrada</option>
              <option value='OUTCOME'>Saída</option>
            </Select>

            <TagInput 
              label="Tags"
              name="tags"
              tagUppercased
              register={register}
              setValue={(value) => setValue('tags', value)}
              control={control}
              canCreateTags
              tags={tags}
              addTag={addTag}
            />

            <Button isLoading={isLoading} mt="2" type="submit">
              Criar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
