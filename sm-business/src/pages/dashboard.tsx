import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import { CustomTable } from "../components/CustomTable";
import { Filters } from "../components/Filters";
import { Header } from "../components/Header";
import { useApiErrorToasts } from "../hooks/useApiErrorToasts";
import { getSummarizedMovements } from "../services/api";
import { MovementsSummaryParams } from "../services/api/routes/getSummarizedMovements";
import { queryClient } from "../services/queryClient";
import { toBRL, currencyToNumber } from "../utils";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function Dashboard() {  
  const [filters, setFilters] = useState<MovementsSummaryParams>({
    groupBy: 'year'
  });
  const { data: summarizedMovements, error, isLoading } = useQuery(
    ["summarizedMovements", filters], getSummarizedMovements(filters) 
  );
  const tooltipTheme = useColorModeValue('light', 'dark');
  useApiErrorToasts(error);

  async function handleFilter(receivedFilters: MovementsSummaryParams) {
    setFilters(receivedFilters);    
    queryClient.fetchQuery(["summarizedMovements", filters], getSummarizedMovements(filters));    
  }

  const data = useMemo(() => {
    if (!summarizedMovements) return [];

    const balance = summarizedMovements.reduce((acc, cur) => {
      acc.income += currencyToNumber(cur.income);
      acc.outcome += currencyToNumber(cur.outcome);
      acc.total += currencyToNumber(cur.total);
      return acc;
    }, {      
      income: 0,
      outcome: 0,
      total: 0,
    });

    return [
      ...summarizedMovements,
      {
        id: "Total",
        group: "Total",
        income: toBRL(balance.income.toString()),
        outcome: toBRL(balance.outcome.toString()),
        total: toBRL(balance.total.toString()),
      }
    ];
  }, [summarizedMovements])

  return (
    <Flex
      flex="1"
      justifyContent="center"      
    >
      <Flex 
        direction="column" 
        alignItems="center"
        w="100%"
        maxW="7xl" 
        px={['6', '8', '16']} 
        py="8"
      >
        <Header title="Dashboard"/>

        <Box id="chart" width="100%" h="40vh" mt="10">
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
                  categories: data.map(item => item.group)
                },
                fill: {
                  opacity: 1
                },
                tooltip: {
                  theme: tooltipTheme,
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
              height="100%"
            />
          )}
        </Box>        

        <Filters 
          isLoading={isLoading}
          onFilter={handleFilter}
          canCreateTags
          showGroupByFilter
        />  

       <Box width="100%" h={["30vh", "32vh", "35vh", "38vh"]}>
        <CustomTable 
          columnsConfig={[{
            propertyName: "group",
            columnName: "Grupo",
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
          data={data}
        />
       </Box>

      </Flex>
    </Flex>
  );
}

