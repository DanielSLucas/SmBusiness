import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Button, useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";

import { createMovement, listMovements } from "../services/api";
import { Input } from "./Inputs/Input";
import { Select } from "./Inputs/Select";
import { TagInput } from "./Inputs/TagInput";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../services/queryClient";
import { useTags } from "../hooks/useTags";
import { AutoCompleteInput, AutoCompleteInputOption } from "./Inputs/AutoCompleteInput";
import { useNewMovementModal } from "../hooks/useNewMovementModal";

export interface NewMovementFormData {
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string;
}

const schema = Yup.object({
  description: Yup.string().required("Descrição é obrigatória"),
  amount: Yup.number()
    .typeError("Valor deve ser um número válido")
    .positive("Valor deve ser um número maior que zero")
    .required("Valor é obrigatório"),
  date: Yup.date().typeError("Data deve ser uma data válida").required("Data é obrigatória"),
  type: Yup.string().oneOf(['INCOME', 'OUTCOME']).required("Tipo é obrigatório"),
  tags: Yup.string().uppercase().required('Tags são obrigatórias'),
})

export const NewMovementModal: React.FC = () => {
  const { isOpen, onClose } = useNewMovementModal();
  const router = useRouter();
  const toast = useToast();
  const { tags, addTag } = useTags();
  const { mutateAsync } = useMutation(createMovement, {
    onSuccess: () => {
      queryClient.invalidateQueries('movements')
    }
  })
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    control,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<NewMovementFormData>({
    resolver: yupResolver(schema),
  });  
  const descriptionCurrentValue = watch("description", '');
  const { data: movements } = useQuery(
    ['movements', { description: descriptionCurrentValue, distinct: "description", orderBy: "description" }], 
    listMovements({ description: descriptionCurrentValue, distinct: "description", orderBy: "description" })
  );

  const handleNewMovementFormSubmit: SubmitHandler<NewMovementFormData> = async (data) => {
    try {
      await mutateAsync(data)

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
    }
  }

  function handleAutoCompleteOptionClick(option: AutoCompleteInputOption) {
    if (movements) {
      const movement = movements.find(mv => mv.id === option.id);

      if (movement) {
        setValue('amount', Number(movement.amount));
        setValue('type', movement.type);
        setValue('tags', movement.tags.map((tag) => tag).join(";"));        
        setFocus("date")  
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
          <Flex 
            as="form" 
            direction="column" 
            gap="2" 
            onSubmit={handleSubmit(handleNewMovementFormSubmit)}
          >
            <AutoCompleteInput 
              label="Descrição"
              placeholder="Descrição"
              name="description"
              register={register}
              error={errors.description}              
              autoCompleteOptions={movements?.map(mv => ({ id: mv.id, value: mv.description })) ?? []}
              currentValue={descriptionCurrentValue}
              setValue={(value) => setValue('description', value)}
              onOptionClick={handleAutoCompleteOptionClick}
            />

            <Input 
              label="Valor"
              placeholder="Valor"
              name="amount"
              type="number"
              step="0.01"
              register={register}
              error={errors.amount}
            />

            <Input 
              label="Data"
              placeholder="Data"
              name="date"
              type="date"
              register={register}
              error={errors.date}
            />

            <Select
              label="Tipo"
              placeholder='Entrada/Saída'
              name="type"
              register={register}
              error={errors.type}
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
              error={errors.tags}
              clearErrors={() => clearErrors("tags")}
            />

            <Button isLoading={isSubmitting} mt="2" type="submit">
              Criar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
