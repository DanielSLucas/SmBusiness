import { 
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  useColorModeValue 
} from "@chakra-ui/react";

import { TableSkeletonRow } from "../TableSkeletonRow";
import { CustomTableRow } from "./CustomTableRow";

export type CustomTableColumnConfig = {
  propertyName: string;
  columnName: string;
  valueColor?: string;
  colSpan: number;
}

export type CustomTableData = {
  id: string | number;
  [key: string]: any;
}

interface CustomTableProps {
  columnsConfig: CustomTableColumnConfig[];
  data: CustomTableData[];
  caption?: string;
}

export const CustomTable: React.FC<CustomTableProps> = ({ columnsConfig, data, caption }) => {
  const headColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <TableContainer 
      w="100%" 
      h="100%"      
      overflowX="auto" 
      overflowY="scroll"
    >
      <Table variant="unstyled" size={{ base: "sm", md: "md" }}>
        {caption && <TableCaption>{caption}</TableCaption>}

        <Thead position="sticky" top={0}  zIndex={1} bg={headColor}>
          <Tr>
            {columnsConfig.map(columnConfig => (
              <Th 
                key={columnConfig.propertyName} 
                colSpan={columnConfig.colSpan} 
                fontSize="md"
              >
                {columnConfig.columnName}
              </Th>
            ))}
          </Tr>    
        </Thead>
        <Tbody>          
          {data.length 
            ? data.map(item => (
                <CustomTableRow key={item.id} data={item} columnsConfig={columnsConfig}/>
              )) 
            : Array.from({ length: 9 }).map((_, i) => (
              <TableSkeletonRow 
                key={`skeleton-row-${i}`}
                colSpan={columnsConfig.reduce((acc, cur) => acc + cur.colSpan ,0)}
                height="16"
              />
            ))
          }
        </Tbody>
      </Table>
    </TableContainer>
  );
}
