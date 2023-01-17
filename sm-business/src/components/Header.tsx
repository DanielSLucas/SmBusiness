import { Button, Flex, Heading, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FiArrowLeft, FiBarChart2, FiDollarSign, FiLogOut, FiMenu, FiMoon, FiSun } from "react-icons/fi";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex w="100%" as="header" justifyContent="space-between" alignItems="center">
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Opções'
          icon={<FiMenu />}          
        />
        <MenuList>
          <MenuItem icon={<FiBarChart2 />} onClick={() => router.push('/dashboard')}>
            Dashboard
          </MenuItem>
          <MenuItem icon={<FiDollarSign />} onClick={() => router.push('/')}>
            Livro Caixa
          </MenuItem>
          <MenuItem icon={<FiArrowLeft />} onClick={() => router.back()}>
            Voltar
          </MenuItem>
        </MenuList>
      </Menu>

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
