import { Flex, Icon, Tag, Td, Text, Tr, useColorModeValue } from "@chakra-ui/react";
import { FiArrowDownCircle, FiArrowUpCircle, FiCalendar, FiHash } from "react-icons/fi";
import { toBRL } from "../utils/toBRL";
import { toLocaleDateString } from "../utils/toLocaleDateString";

interface Movement {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: 'INCOME' | 'OUTCOME';
  tags: {
    tag: {
      id: string;
      name: string;
    }
  }[]
}

interface MovementRowProps {
  movement: Movement;
}

const MovementRow: React.FC<MovementRowProps> = ({ movement }) => {
  const rowBackground = useColorModeValue("white", "#2d3748");
  const boderColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Tr bg={rowBackground} borderBottomWidth={4} borderColor={boderColor} borderRadius="md">
      {/* TIPO */}
      <Td w="4" display={["none", "none", "none", "block"]}>
        {movement.type === 'INCOME' 
          ? <Icon as={FiArrowUpCircle} color="green.400" fontSize="2xl" />
          : <Icon as={FiArrowDownCircle} color="red.400" fontSize="2xl" /> 
        }
      </Td>

      {/* DESCRIÇÃO */}
      <Td colSpan={2}>
        <Flex direction="column" justifyContent="flex-start">
          <Text 
            fontWeight="semibold" 
            fontSize="xl" 
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
              <Text>{toLocaleDateString(movement.date)}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Td>

      {/* TAGS */}
      <Td colSpan={2} display={["none", "block"]}>
        <Flex flexWrap="wrap" gap="2">
          {movement.tags.map(({ tag }) => (
            <Tag key={tag.id} size="sm">
              {tag.name}
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
    </Tr>
  );
}

export default MovementRow;