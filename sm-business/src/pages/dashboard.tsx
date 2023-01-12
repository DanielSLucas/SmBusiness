import { Flex } from "@chakra-ui/react";
import { useQuery } from "react-query";

import { CustomTable } from "../components/CustomTable";
import { Header } from "../components/Header";
import { useApiErrorToasts } from "../hooks/useApiErrorToasts";
import { getSummarizedMovements } from "../services/api";

export default function Dashboard() {
  const { data, error } = useQuery(
    ["summarizedMovements", { groupBy: 'month' }], getSummarizedMovements({ groupBy: 'month' }) 
  );
  useApiErrorToasts(error);

  return (
    <Flex
      flex="1"
      justifyContent="center"
      alignItems="center"      
    >
      <Flex 
        direction="column" 
        alignItems="center" 
        w="7xl" 
        px={['6', '8', '16']} 
        py="8"
      >
        <Header title="Dashboard"/>
        
        <CustomTable 
          columnsConfig={[{
            propertyName: "month",
            columnName: "mês/ano",
            colSpan: 1,            
          }, {
            propertyName: "income",
            columnName: "Entrada",
            colSpan: 1,
            valueColor: "green.500",
          }, {
            propertyName: "outcome",
            columnName: "Saída",
            colSpan: 1,
            valueColor: "red.500",
          }, {
            propertyName: "total",
            columnName: "Total",
            colSpan: 1,            
          }]}
          data={data ?? []}
        />

      </Flex>
    </Flex>
  );
}

