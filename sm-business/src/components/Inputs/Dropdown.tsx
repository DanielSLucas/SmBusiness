import React, { ReactNode, useRef } from 'react';
import { Flex, useColorModeValue, useOutsideClick } from '@chakra-ui/react';

interface DropdownProps {
  children: ReactNode;
  setIsShowingDropdown: (isShowingDropdown: boolean) => void;
  shouldStayOpen: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  children, 
  setIsShowingDropdown, 
  shouldStayOpen 
}) => {
  const dropDownBgColor = useColorModeValue("gray.50", "gray.600");
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsShowingDropdown(shouldStayOpen || false),
  })

  return (
    <Flex
      ref={dropdownRef}
      flexWrap="wrap"
      w="100%"
      position="absolute" 
      top="100%"
      zIndex={3}
      overflowY="scroll"
      maxH="24"
      bg={dropDownBgColor} 
      mt="2"      
      p="4"   
      gap="2"
      borderRadius="md"
      border="1px solid"
      borderColor="inherit"
    >
      {children}
    </Flex>
  );
};
