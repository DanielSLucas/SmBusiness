import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Button,
  Text,
  Code,
  useToast,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import * as Yup from "yup";

import { FileUpload } from './Inputs/FileUpload';
import { importMovements } from '../services/api/routes/importMovements';
import { queryClient } from '../services/queryClient';
import { useGlobalDisclosure } from '../hooks/useGlobalDisclosure';

const schema = Yup.object({
  file: Yup.mixed()
    .test("fileType", "O envio de 1 um arquivo no formato '.tsv' é obrigatório.", (file: File) => {
      if (!file?.name) return false;

      const splitedFileName = file.name.split('.');
      const fileExtension = "." + splitedFileName[splitedFileName.length - 1];
      
      return [".tsv", "text/tsv"].includes(file.type || fileExtension)
    })
})

export const ImportMovementsModal: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<{ file: File }>({
    resolver: yupResolver(schema),
  });
  const { onClose, isOpen } = useGlobalDisclosure("importMovementsModal");
  const { mutateAsync } = useMutation(importMovements, {
    onSuccess: () => {
      queryClient.invalidateQueries('movements');
      queryClient.invalidateQueries('movements/balance');
    }
  })

  const handleImportMovementsFormSubmit: SubmitHandler<{ file: File }> = async (data) => {
    try {
      await mutateAsync(data.file)

      toast({
        title: "Movimentos de caixa importados com sucesso!",
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
          title: "Erro ao importar movimentos de caixa.",
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
        <ModalHeader>Importar movimentações</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          <Flex direction="column">
            <Text>
              Para fazer a importação das movimentações faça o upload de um
              arquivo {" "}
              <Code as="span">
                .tsv
              </Code>
              {" "}(<i>tab separeted values</i>) no seguinte formato:
            </Text>
            <Code
              as="pre"
              p="4"
              mt="8"              
              w="100%"
              borderRadius="sm"
              fontSize="sm"
            >
              date	description	type	amount	tags/0	tags/1{'\n'}
              2018-01-01	Salário	INCOME	1300.00	CC	TRABALHO{'\n'}
              2018-01-10	Inglês	OUTCOME	240.00	ESTUDOS{'\n'}
              ...
            </Code>
          </Flex>

          <Flex 
            as="form" 
            px="2"
            mt="4"
            direction="column" 
            gap="2" 
            onSubmit={handleSubmit(handleImportMovementsFormSubmit)}
          >
            <FileUpload 
              label='Arquivo'
              placeholder="Solte o arquivo aqui, ou clique para seleciona-lo"
              onDragActivePlaceholder="Solte o arquivo aqui..."
              acceptedFileTypes={{
                "text/tsv": ['.tsv']
              }}
              error={errors.file}
              register={register}
              control={control}              
            />

            <Button isLoading={false} mt="2" type="submit">
              Criar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
