import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";

import { api } from "../services/api";
import { Balance } from "../components/Balance";
import { Header } from "../components/Header";
import { MovementsTable } from "../components/MovementsTable";
import { FiltersData, FiltersDrawer } from "../components/FiltersDrawer";

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

interface HomeProps {
  balance: {
    income: string;
    outcome: string;
    total: string;
  }
}

export default function Home({ balance }: HomeProps) {
  const { data: session, status } = useSession();  
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    if(session) {
      (async function getMovements() {
        const response = await api.get<Movement[]>('/movements', {
          headers: {
            authorization: `Bearer ${session.accessToken}`
          },          
        });
  
        setMovements(response.data);
      })();
    }
  }, [session])

  async function handleFilter(filters: Partial<FiltersData>) {
    if(session) { 
      const response = await api.get<Movement[]>('/movements', {
        params: filters,
        headers: {
          authorization: `Bearer ${session.accessToken}`
        },          
      });
  
      setMovements(response.data);
    }    
  }

  if (status === "loading" || status === "unauthenticated") {
    return(
      <Flex
        flex="1"
        justifyContent="center"
        alignItems="center"
      >
        <Flex direction="column" alignItems="center">
          <Heading>Loading...</Heading>        
        </Flex>
      </Flex>
    )
  }  

  return (
    <Flex
      flex="1"
      justifyContent="center"
      alignItems="center"
    >
      <Flex direction="column" alignItems="center" w="7xl" px={['6', '8', '16']} >
        <Header title="Livro caixa"/>
        <Balance balance={balance} />                
        <FiltersDrawer onFilter={handleFilter}/>
        <MovementsTable movements={movements}/>
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

  let balance;

  try {
    const response = await api.get('/movements/balance', {
      headers: {
        authorization: `Bearer ${session.accessToken}`
      }
    });

    balance = response.data[0];
  } catch (error) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    }
  }
  
  return {
    props: {
      balance,
    }
  }
}