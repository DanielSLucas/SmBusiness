import { FormControl, FormErrorMessage, FormLabel, Select as ChakraSelect, SelectProps as ChakraSelectProps } from '@chakra-ui/react';
import { FieldError, UseFormRegister } from 'react-hook-form';

export interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  register: UseFormRegister<any>;  
  error?: FieldError;
}

export const Select: React.FC<SelectProps> = ({ 
  name, 
  label, 
  register,
  error = undefined,
  children,
  ...rest 
}) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label  && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraSelect
        id={name}
        {...rest}
        {...register(name)}        
      >
        {children}
      </ChakraSelect>

      {!!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}
