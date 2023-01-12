import { Td, Tr, useColorModeValue } from "@chakra-ui/react";
import { CustomTableColumnConfig, CustomTableData } from ".";

interface CustomTableRowProps {
  columnsConfig: CustomTableColumnConfig[];
  data: CustomTableData;  
}

export const CustomTableRow: React.FC<CustomTableRowProps> = ({ data, columnsConfig }) => {
  const rowBackground = useColorModeValue("white", "#2d3748");
  const boderColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Tr bg={rowBackground} borderBottomWidth={4} borderColor={boderColor} borderRadius="md">
      {columnsConfig.map(({ propertyName, colSpan, valueColor })=> (
        <Td 
          key={`${propertyName}_${data.id}`} 
          colSpan={colSpan}
          {...(valueColor ? { color: valueColor } : {})}              
        >
          {data[propertyName]}
        </Td>
      ))}
    </Tr>
  );
}
