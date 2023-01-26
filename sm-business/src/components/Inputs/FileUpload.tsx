import { Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Control, FieldError, useController, UseFormRegister } from 'react-hook-form';
import { FiFileText, FiX } from 'react-icons/fi';

interface FileUploadProps {
  label?: string;
  error?: FieldError;
  placeholder: string;
  onDragActivePlaceholder: string;
  acceptedFileTypes: Record<string, string[]>;
  register: UseFormRegister<any>;
  control: Control<any>; 
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label,
  error = undefined,
  placeholder,
  onDragActivePlaceholder,
  acceptedFileTypes,
  register,
  control,
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.600");
  const { field } = useController({
    name: "file",
    control,
    defaultValue: {} as File,    
  });
  const [file, setFile] = useState({} as File);

  const onDrop = ([file]: File[]) => {    
    if (!file) return;
    field.onChange(file)
    setFile(file);
  };

  const clearInput = () => {
    field.onChange({} as File)
    setFile({} as File);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: acceptedFileTypes,
    multiple: false,
  });
  return (
    <FormControl 
      isInvalid={!!error}
      display="flex"      
      flexDirection="column"
    >
      {!!label  && <FormLabel htmlFor="file">{label}</FormLabel>}

      <Flex
        {...getRootProps()}
        position="relative"
        direction="column"
        alignItems="center"
        justifyContent="center"
        w="100%"        
        bg={bgColor}          
        p="4"
        outline="2px solid transparent" 
        outlineOffset={2}
        border="1px solid"
        borderColor={!!error ? "#FC8181" : "inherit"}
        borderRadius="md"
        _hover={{ cursor: "pointer"}}
        _focusWithin={{ 
          borderColor: "#63b3ed",
          boxShadow: "0 0 0 1px #63b3ed"
        }}
        {...(!!error ? {
          boxShadow: "0 0 0 1px #FC8181"
        } : {})}
      >
        {file.name && (
          <IconButton
            variant="link"
            icon={<FiX />}
            aria-label="Remover arquivo"
            position="absolute"
            top={2}
            right={0}
            zIndex={999}
            onClick={clearInput}
          />
        )}

        <input 
          {...getInputProps()}
          {...register("file")}
        />

        <Icon as={FiFileText} h="8" w="8" />
        <Text align="center" mt="2">
          
          {!isDragActive && file.name && file.name}
          {!isDragActive && !file.name && placeholder}
          {isDragActive && onDragActivePlaceholder}
        </Text>
      </Flex>

      {!!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
