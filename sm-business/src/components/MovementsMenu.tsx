import { IconButton, Menu, MenuButton, MenuGroup, MenuItem, MenuList } from "@chakra-ui/react";
import { FiDownload, FiMoreHorizontal, FiPlus, FiUpload } from "react-icons/fi";

import { useGlobalDisclosure } from "../hooks/useGlobalDisclosure";

export const MovementsMenu: React.FC = () => {  
  const { onOpen: onOpenNewMovementModalOpen } = useGlobalDisclosure("newMovementModal");
  const { onOpen: onOpenImportMovementsModalOpen } = useGlobalDisclosure("importMovementsModal");
  const { onOpen: onOpenExportMovementsAlertDialog } = useGlobalDisclosure("exportMovementsAlertDialog");

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        icon={<FiMoreHorizontal />}
        aria-label='Mais opções'        
        colorScheme="yellow"
        size={{ base: "xs", md: "sm"}}
      />
      <MenuList>
        <MenuGroup title="Movimentações" textAlign="start">
          <MenuItem icon={<FiPlus />} onClick={onOpenNewMovementModalOpen}>
            Nova
          </MenuItem>
          <MenuItem icon={<FiUpload />} onClick={onOpenImportMovementsModalOpen}>
            Importar
          </MenuItem>
          <MenuItem icon={<FiDownload />} onClick={onOpenExportMovementsAlertDialog}>
            Exportar
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
