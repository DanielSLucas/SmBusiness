import { Box, Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr, useColorModeValue } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import MovementRow from "./MovementRow";
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
}

export const MovementsTable: React.FC<MovementsTableProps> = ({ movements }) => {
  const headColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box w="100%" position="relative">
      <MovementsMenu />
      <TableContainer w="100%" h={{ base: "51vh", lg: "57.2vh" }} overflowY="scroll">
        <Table variant="unstyled">
          <TableCaption>Movimentações</TableCaption>
          <Thead position="sticky" top={0}  zIndex={1} bg={headColor}>
            <Tr>
              <Th w="4" fontSize="md" display={{ base: "none", lg: "block" }}>
                Tipo
              </Th>
              <Th colSpan={2} fontSize="md">Descrição</Th>
              <Th colSpan={2} fontSize="md" display={["none", "block"]}>
                Tags
              </Th>
              <Th fontSize="md">Valor</Th>
            </Tr>    
          </Thead>
          <Tbody>          
            {movements.length 
              ? movements.map(movement => (
                  <MovementRow key={movement.id} movement={movement}/>
                )) 
              : Array.from({ length: 9 }).map((_, i) => (
                <TableSkeletonRow 
                  key={`skeleton-row-${i}`}
                  height="16"
                  colSpan={6}
                />
              ))
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
