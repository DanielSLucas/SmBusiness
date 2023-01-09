import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";
import { FieldError, UseFormRegister } from "react-hook-form";

export interface InputProps extends ChakraInputProps{
  name: string;
  label?: string;
  register: UseFormRegister<any>;  
  error?: FieldError;
}

export function Input({ 
  name, 
  label, 
  register,
  error = undefined,
  ...rest 
}: InputProps) {  
  return (
    <FormControl isInvalid={!!error}>
      {!!label  && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraInput  
        id={name}
        {...rest}
        {...register(name)}
      />

      {!!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}
