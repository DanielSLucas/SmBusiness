import { 
  Box,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,  
  Th,
  Thead,
  Tr,
  useColorModeValue 
} from "@chakra-ui/react";
import { useCallback, useRef } from "react";

import { MovementRow } from "./MovementRow";
import { MovementsMenu } from "./MovementsMenu";
import { TableSkeletonRow } from "./TableSkeletonRow";

interface Movement {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string[]
}

interface MovementsTableProps {
  movements: Movement[];
  infinityScrollProps: {
    hasNextPage: boolean;    
    isFetching: boolean;
    fetchNextPage: () => Promise<any>;
  }
}

export const MovementsTable: React.FC<MovementsTableProps> = ({ 
  movements,
  infinityScrollProps,
}) => {
  const headColor = useColorModeValue('gray.50', 'gray.900');
  const { 
    hasNextPage,
    fetchNextPage,    
    isFetching,    
  } = infinityScrollProps;
  
  const observer = useRef<any>();
  const currentLastRowRef = useCallback((node: HTMLTableRowElement | null) => {
    if (isFetching) return;

    if (observer.current) {      
      observer.current.disconnect()
    };

    observer.current = new IntersectionObserver(([entry]) => {
      const currentNode = node;
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage().then(() => currentNode?.scrollIntoView({ block: "end" }));
      }
    })

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetching])

  return (
    <Box w="100%" position="relative">
      
      <TableContainer w="100%" h={{ base: "51vh", lg: "57.2vh" }} overflowY="scroll" >
        <Table variant="unstyled" size={{ base: 'sm', md: "md", lg: "lg" }}>
          <TableCaption>Movimentações</TableCaption>
          <Thead position="sticky" top={0}  zIndex={1} bg={headColor}>
            <Tr>
              <Th w="4" fontSize="md" display={{ base: "none", lg: "table-cell" }}>
                Tipo
              </Th>
              <Th colSpan={2} fontSize="md">Descrição</Th>
              <Th colSpan={2} fontSize="md" display={["none", "table-cell"]}>
                Tags
              </Th>
              <Th fontSize="md">Valor</Th>
              <Th textAlign="end"><MovementsMenu /></Th>
            </Tr>
          </Thead>
          <Tbody>
            {movements.length ? movements.map((movement, i) => (
              <MovementRow
                key={movement.id}
                movement={movement}
                {...(movements.length === i + 1 && { ref: currentLastRowRef })}
              />
            )) : ''}
            {!movements.length && isFetching 
              ? Array.from({ length: 9 }).map((_, i) => (
                  <TableSkeletonRow 
                    key={`skeleton-row-${i}`}
                    height="16"
                    colSpan={7}
                  />
                ))
              : (
                <Tr>
                  <Td colSpan={7} textAlign="center">
                    Não foram encontrados movimentos {"=("}
                  </Td>
                </Tr>
              )
            }
            {isFetching && (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
