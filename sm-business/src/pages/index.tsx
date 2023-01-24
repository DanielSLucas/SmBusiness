import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { useQuery } from "react-query";

import { listMovements } from "../services/api";

import { Balance } from "../components/Balance";
import { Header } from "../components/Header";
import { MovementsTable } from "../components/MovementsTable";
import { FiltersData, Filters } from "../components/Filters";
import { NewMovementModal } from "../components/NewMovementModal";
import { ImportMovementsModal } from "../components/ImportMovementsModal";
import { useApiErrorToasts } from "../hooks/useApiErrorToasts";
import { getBalance } from "../services/api/routes/getBalance";

export interface Movement {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: 'INCOME' | 'OUTCOME';
  tags: string[]
}

type Balance = {
  income: string;
  outcome: string;
  total: string;
}

export default function Home() {
  const [filters, setFilters] = useState<Partial<FiltersData>>({});
  const { data: movements, isLoading, error: movementsError } = useQuery(
    ['movements', filters], listMovements({...filters, page: 1, perPage: 20}),
    { staleTime: 1000 * 60 * 10 }
  );
  const { data: balance, error: balanceError } = useQuery(
    ['movements/balance', filters], getBalance(filters),
    { staleTime: 1000 * 60 * 10 }
  )
  useApiErrorToasts(movementsError);
  useApiErrorToasts(balanceError);

  async function handleFilter(receivedFilters: Partial<FiltersData>) {
    setFilters(receivedFilters);
  }

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
        <Header title="Livro caixa"/>
        <Balance balance={balance} />                
        <Filters onFilter={handleFilter} isLoading={isLoading} showOrderFilters canCreateTags/>
        <MovementsTable movements={movements || []} />

        <NewMovementModal />
        <ImportMovementsModal />
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  console.log(session, new Date().toISOString());

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    }
  }
  
  return {
    props: {}
  }
}