import { Flex, Button } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import * as Yup from "yup";

import { useTags } from "../hooks/useTags";
import { listMovements } from "../services/api";

import { AutoCompleteInput, AutoCompleteInputOption } from "./Inputs/AutoCompleteInput";
import { TagInput } from "./Inputs/TagInput";
import { Input } from "./Inputs/Input";
import { Select } from "./Inputs/Select";

export interface MovementFormData {
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string;
}

interface MovementFormProps {
  onSubmit: (data: MovementFormData) => Promise<void>;
  defaultValues?: MovementFormData;
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

export const MovementForm: React.FC<MovementFormProps> = ({ onSubmit, defaultValues }) => {
  const { tags, addTag } = useTags();
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
  } = useForm<MovementFormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });  
  const descriptionCurrentValue = watch("description", defaultValues?.description || '');
  const { data } = useQuery(
    ['movements', { description: descriptionCurrentValue, distinct: "description", orderBy: "description" }], 
    listMovements({ description: descriptionCurrentValue, distinct: "description", orderBy: "description" })
  );
  const movements = data?.data || [];

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

  const handleFormSubmit: SubmitHandler<MovementFormData> = (data) => {
    onSubmit(data);
    reset();
  }

  return (
    <Flex 
      as="form" 
      direction="column" 
      gap="2" 
      onSubmit={handleSubmit(handleFormSubmit)}
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
        Enviar
      </Button>
    </Flex>
  );
}
