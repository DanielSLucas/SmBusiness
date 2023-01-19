import { IconButton, Menu, MenuButton, MenuGroup, MenuItem, MenuList } from "@chakra-ui/react";
import { FiDownload, FiMoreHorizontal, FiPlus, FiUpload } from "react-icons/fi";
import { useImportMovementsModal } from "../hooks/useImportMovementsModal";
import { useNewMovementModal } from "../hooks/useNewMovementModal";

interface MovementsMenuProps {}

export const MovementsMenu: React.FC<MovementsMenuProps> = () => {  
  const { onOpen: onOpenNewMovementModalOpen } = useNewMovementModal();
  const { onOpen: onOpenImportMovementsModalOpen } = useImportMovementsModal();

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        icon={<FiMoreHorizontal />}
        aria-label='Mais opções'        
        colorScheme="yellow"
        size="sm"
        position="absolute"
        zIndex={2}
        right={1}
        top={1}
      />
      <MenuList>
        <MenuGroup title="Movimentações">
          <MenuItem icon={<FiPlus />} onClick={onOpenNewMovementModalOpen}>
            Nova
          </MenuItem>
          <MenuItem icon={<FiUpload />} onClick={onOpenImportMovementsModalOpen}>
            Importar
          </MenuItem>
          <MenuItem icon={<FiDownload />} onClick={() => {}}>
            Exportar
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
