import { 
  Box,
  Button,
  Flex,  
} from "@chakra-ui/react";
import { Control, FieldValues, UseFormRegister } from "react-hook-form";
import { FiltersData } from "./Filters";

import { DateInput } from "./Inputs/DateInput";
import { Input } from "./Inputs/Input";
import { Select } from "./Inputs/Select";
import { Tag, TagInput } from "./Inputs/TagInput";

interface FiltersFormProps {
  onSubmit: () => {};
  register: UseFormRegister<FiltersData>;
  setValue: (value: string) => void;
  control: Control<FiltersData>;
  tags: Tag[];
}

export const FiltersForm: React.FC<FiltersFormProps> = ({ 
  onSubmit, 
  register, 
  setValue, 
  tags,
  control, 
}) => {
  return (
    <Flex 
      as="form" 
      gap="4" 
      flexWrap="wrap" 
      p="4"            
      mb={{ base: 0, lg: "5" }}
      onSubmit={onSubmit}
    >
      <Flex w="100%" gap="4" direction={{base: "column", lg: "row"}}>
        <Input 
          label="Descrição"
          placeholder="Descrição"
          name="description"
          register={register}        
        />
      
        <DateInput inputProps={{ register, name: 'date' }}/>
      </Flex>
      
      <Flex w="100%" gap="4" direction={{base: "column", lg: "row"}}>
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
      </Flex>

      <TagInput 
        label="Tags"
        name="tags"
        tagUppercased
        register={register}
        setValue={setValue}
        control={control}     
        tags={tags}
      />      
      
      <Button w="100%" type="submit" mt="2">
        Filtrar
      </Button>
    </Flex>
  );
}
