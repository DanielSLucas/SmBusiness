import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

interface TagInputContainerProps {
  children: ReactNode;
  isInvalid?: Boolean;
}

export const TagInputContainer: React.FC<TagInputContainerProps> = ({ children, isInvalid = false }) => {
  return (
    <Flex 
      w="100%"
      minH="10"
      flexWrap="wrap"
      gap="1"
      outline="2px solid transparent" 
      outlineOffset={2}
      border="1px solid"
      borderColor={isInvalid ? "#FC8181" : "inherit"}
      borderRadius="md"
      py="2"
      px="4"
      _focusWithin={{ 
        borderColor: "#63b3ed",
        boxShadow: "0 0 0 1px #63b3ed"
      }}
      {...(isInvalid ? {
        boxShadow: "0 0 0 1px #FC8181"
      } : {})}
    >
      {children}
    </Flex>
  )
}
