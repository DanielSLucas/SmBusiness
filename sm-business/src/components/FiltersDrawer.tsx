import { 
  Button,
  Drawer,
  DrawerContent,
  Flex,
  Icon, 
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiFilter } from "react-icons/fi";
import { DateInput } from "./Form/DateInput";
import { Input } from "./Form/Input";
import { Select } from "./Form/Select";

export interface FiltersData {
  orderBy: 'id' | 'date' | 'description' | 'amount' | 'type';
  order: 'asc' | 'desc';
  date: Date;
  startDate: Date;
  endDate: Date;
  description: string;
}

interface FiltersDrawerProps {
  onFilter(filters: Partial<FiltersData>): void;
}

export const FiltersDrawer: React.FC<FiltersDrawerProps> = ({ onFilter }) => {
  const { register, handleSubmit, reset } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure()
    
  const onSubmit: SubmitHandler<Partial<FiltersData>> = (data) => {
    console.log(data);
    const filters = Object.keys(data).reduce((prev, curr) => {
      const key = curr as keyof Partial<FiltersData>;

      if(data[key]) {
        prev[key] = data[key];
      }

      return prev;
    }, {} as Record<string, any>);

    onFilter(filters);
    reset();
    onClose();
  }

  return (
    <>
      <Button onClick={onOpen} w="100%" my="4">
        <Flex gap="2" alignItems="center">
          <Text>Filtros</Text>
          <Icon as={FiFilter} />
        </Flex>
      </Button>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerContent p="4">          
          <Flex as="form" gap="4" flexWrap="wrap" p="2" onSubmit={handleSubmit(onSubmit as any)}>
            <Input 
              label="Descrição"
              placeholder="Descrição"
              name="description"
              register={register}
            />
            
            <DateInput props={{ register, name: 'date' }}/>

            <Select
              label="Ordenar por"
              placeholder="Selecionar campo"
              name="orderBy"
              register={register}
            >
              <option value='id'>Id</option>
              <option value='date'>Data</option>
              <option value='description'>Descrição</option>
              <option value='amount'>Valor</option>
              <option value='type'>Tipo</option>
            </Select>
            
            <Select
              label="Ordem"
              placeholder='Crescente/Decrescente'
              name="order"
              register={register}
            >
              <option value='asc'>Crescente</option>
              <option value='desc'>Decrescente</option>
            </Select>
            
            <Button w="100%" type="submit">
              Filtrar
            </Button>
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
}
