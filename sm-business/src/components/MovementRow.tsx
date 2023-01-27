import { forwardRef } from "react";
import { FiArrowDownCircle, FiArrowUpCircle, FiCalendar, FiEdit3, FiHash, FiTrash2 } from "react-icons/fi";
import { 
  Flex,
  Icon,
  IconButton,
  Tag,
  Td,
  Text,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { formatted, toBRL } from "../utils";
import { DeleteMovementAlertDialog } from "./DeleteMovementsAlertDialog";

interface Movement {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string[]
}

interface MovementRowProps {
  movement: Movement;
}

const MovementRowBase: React.ForwardRefRenderFunction<any, MovementRowProps> = ({ 
  movement 
}, ref) => {
  const { 
    isOpen: isDeleteMovementAlertDialogOpen, 
    onClose: onDeleteMovementAlertDialogClose,
    onOpen: onDeleteMovementAlertDialogOpen,
  } = useDisclosure();

  const rowBackground = useColorModeValue("white", "#2d3748");
  const boderColor = useColorModeValue('gray.50', 'gray.900');
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <>
      <Tr 
        ref={ref}
        bg={rowBackground} 
        borderBottomWidth={4} 
        borderColor={boderColor} 
        borderRadius="md"      
      >
        {/* TIPO */}
        <Td w="4" display={{base: "none", lg: "table-cell"}}   >
          {movement.type === 'INCOME' 
            ? <Icon as={FiArrowUpCircle} color="green.400" fontSize="2xl" aria-label="Entrada"/>
            : <Icon as={FiArrowDownCircle} color="red.400" fontSize="2xl" aria-label="Saída"/> 
          }
        </Td>

        {/* DESCRIÇÃO */}
        <Td colSpan={2}>
          <Flex direction="column" justifyContent="flex-start">
            <Text 
              aria-label={movement.description}
              fontWeight="semibold" 
              fontSize={{base: "lg", lg: "xl"}}
              overflow="hidden" 
              textOverflow="ellipsis" 
              maxW={['24', '28', '36', '48']}
              pb="2"
            >
              {movement.description}
            </Text>
            <Flex fontSize="sm" color="gray.500" gap="4">
              <Flex alignItems="center" gap="2" display={["none", "none", "none", "flex"]}>
                <Icon as={FiHash} />
                <Text>{movement.id}</Text>
              </Flex>
              <Flex alignItems="center" gap="2">
                <Icon as={FiCalendar} />
                <Text>{formatted(movement.date)}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Td>

        {/* TAGS */}
        <Td colSpan={2} display={["none", "table-cell"]}>
          <Flex flexWrap="wrap" gap="2">
            {movement.tags.map((tag, i) => (
              <Tag key={`movementRow_tag_${tag}_#${i}`} size="sm">
                {tag}
              </Tag>
            ))}
          </Flex>
        </Td>

        {/* VALOR */}
        <Td>
          <Text color={movement.type === 'OUTCOME' ? 'red.500': 'green.500'}>
            {movement.type === 'OUTCOME' && '-'}
            {toBRL(movement.amount)}
          </Text>
        </Td>

        {/* AÇÕES */}
        <Td textAlign="end">
          <Flex flexWrap="wrap" gap="2" justifyContent="flex-end">
            <IconButton
              size={iconButtonSize}
              aria-label="editar" 
              icon={<FiEdit3 />} 
              variant="outline"
              onClick={() => {}}
            />
            <IconButton 
              size={iconButtonSize}
              aria-label="excluir" 
              icon={<FiTrash2 />} 
              variant="outline"
              onClick={() => onDeleteMovementAlertDialogOpen()}
            />
          </Flex>
        </Td>
      </Tr>

      <DeleteMovementAlertDialog 
        isOpen={isDeleteMovementAlertDialogOpen}
        onClose={onDeleteMovementAlertDialogClose}
        movement={movement}
      />
    </>
  );
}

export const MovementRow = forwardRef(MovementRowBase);