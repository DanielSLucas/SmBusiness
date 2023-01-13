import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";

import { CustomTable } from "../components/CustomTable";
import { Header } from "../components/Header";
import { useApiErrorToasts } from "../hooks/useApiErrorToasts";
import { getSummarizedMovements } from "../services/api";
import { currencyToNumber } from "../utils/currencyToNumber";
import { toBRL } from "../utils/toBRL";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

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
        
        <Box id="chart" width="100%" mt="10">
          {data && (
            <ReactApexChart 
              options={{                
                chart: {
                  type: 'bar',
                  height: 350,
                  foreColor: 'var(--chakra-colors-chakra-body-text)',
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '65%',
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ['transparent']
                },
                xaxis: {
                  categories: data.map(item => item.month)
                },
                fill: {
                  opacity: 1
                },
                tooltip: {
                  theme: 'dark',
                  y: {
                    formatter: (val) => toBRL(String(val)),                    
                  }
                }
              }}
              series={[
                { name: "Entrada", data: data.map(item => currencyToNumber(item.income)), color: "var(--chakra-colors-green-300)" },
                { name: "Saída", data: data.map(item => currencyToNumber(item.outcome)), color: "var(--chakra-colors-red-300)" },
                { name: "Total", data: data.map(item => currencyToNumber(item.total)), color: "var(--chakra-colors-blue-300)" },
              ]}
              type="bar"
              height={350}              
            />
          )}
        </Box>

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

