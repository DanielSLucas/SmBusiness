import { Button, FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { Dropdown } from "../Dropdown";

export type AutoCompleteInputOption = {
  id: number | string; 
  value: string
}

export interface InputProps extends ChakraInputProps{
  name: string;
  label?: string;
  register: UseFormRegister<any>;  
  error?: FieldError;
  autoCompleteOptions: AutoCompleteInputOption[];
  currentValue: string;
  setValue: (value: string) => void;
  onOptionClick?: (option: AutoCompleteInputOption) => void;
}

export function AutoCompleteInput({ 
  name, 
  label, 
  register,
  error = undefined,
  autoCompleteOptions,
  currentValue,
  setValue,
  onOptionClick,
  ...rest 
}: InputProps) {
  const [isShowingDropdown, setIsShowingDropdown] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);  

  function handleOptionClick(option: AutoCompleteInputOption) {
    setValue(option.value)
    onOptionClick?.(option);
    setIsShowingDropdown(false);
  }

  return (
    <FormControl isInvalid={!!error} position="relative">
      {!!label  && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraInput  
        id={name}
        {...rest}
        {...register(name)}
        autoComplete="off"
        onFocusCapture={() => {
          setIsInputFocused(true);
          setIsShowingDropdown(true);
        }}
        onBlurCapture={() => setIsInputFocused(false)}
      />

      {!!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}

      {isShowingDropdown && (
        <Dropdown setIsShowingDropdown={setIsShowingDropdown} shouldStayOpen={isInputFocused}>
          {autoCompleteOptions
            .filter(({ value }) => value.toLowerCase().includes(currentValue.toLowerCase()))
            .map((option) => (
              <Button key={option.id} onClick={() => handleOptionClick(option)} size="sm">
                {option.value}
              </Button>
            ))
          }
        </Dropdown>
      )}
    </FormControl>
  )
}
