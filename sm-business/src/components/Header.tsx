import { Button, Flex, Heading, Icon, Text, useColorMode } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex w="100%" as="header" justifyContent="space-between" alignItems="center">
      <Heading>{title}</Heading>

      <Flex alignItems="center" gap="2">
        <Button onClick={toggleColorMode}>          
          <Icon as={colorMode === 'light' ? FiMoon : FiSun}/>            
        </Button>
        <Button onClick={() => signOut()}>
          <Icon as={FiLogOut}/>
        </Button>
      </Flex>
    </Flex>
  );
}
