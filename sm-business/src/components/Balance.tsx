import { Grid, GridItem } from "@chakra-ui/react";
import { FiArrowDownCircle, FiArrowUpCircle, FiDollarSign } from "react-icons/fi";
import { ValueCard } from "./ValueCard";

interface BalanceProps {
  balance: {
    income: string;
    outcome: string;
    total: string;
  }
}

export const Balance: React.FC<BalanceProps> = ({ balance }) => {  
  return (
    <Grid gap="4" w="100%" mt="8">
      <GridItem>
        <ValueCard 
          title="Entradas"
          color="green"
          value={balance.income}
          icon={FiArrowUpCircle}
        />
      </GridItem>
      
      <GridItem>
        <ValueCard 
          title="Saídas"
          color="red"
          value={balance.outcome}
          icon={FiArrowDownCircle}
        />
      </GridItem>        

      <GridItem colSpan={2}>
        <ValueCard 
          title="Total"
          color="blue"
          value={balance.total}
          icon={FiDollarSign}
        />
      </GridItem>
    </Grid>
  );
}
