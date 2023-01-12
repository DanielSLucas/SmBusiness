import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { Flex, useDisclosure } from "@chakra-ui/react";

import { api, listMovements } from "../services/api";
import { Balance } from "../components/Balance";
import { Header } from "../components/Header";
import { MovementsTable } from "../components/MovementsTable";
import { FiltersData, Filters } from "../components/Filters";
import { NewMovementModal } from "../components/NewMovementModal";
import { Tag } from "../components/Inputs/TagInput";
import { useApiErrorToasts } from "../hooks/useApiErrorToasts";
import { useQuery } from "react-query";
import { queryClient } from "../services/queryClient";

export interface Movement {
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

type Balance = {
  income: string;
  outcome: string;
  total: string;
}

interface HomeProps {
  tags: Tag[];
}

export default function Home({ tags: allTags }: HomeProps) {
  const { onOpen: onModalOpen, onClose: onModalClose, isOpen: isModalOpen } = useDisclosure();
  const [filters, setFilters] = useState<Partial<FiltersData>>({});
  const { data: movements, isLoading, error } = useQuery(
    ['movements', filters], listMovements(filters)
  );
  useApiErrorToasts(error);
  const [tags, setTags] = useState<Tag[]>(allTags);

  function addTag(tagName: string) {
    setTags(prev => [...prev, { name: tagName, selected: false }]);
  }

  async function handleFilter(receivedFilters: Partial<FiltersData>) {
    setFilters(receivedFilters);
    queryClient.fetchQuery(['movements', receivedFilters], listMovements(receivedFilters));    
  }

  const balance = useMemo(() => {
    const totals = {
      income: 0,
      outcome: 0,
      total: 0,
    }

    if (movements) {
      movements.reduce((prev, curr) => {
        if(curr.type === "INCOME") {
          prev.income += Number(curr.amount);
        } else {
          prev.outcome += Number(curr.amount);        
        }        

        return prev;
      }, totals);
    }

    totals.total = totals.income - totals.outcome;

    return {
      income: totals.income.toFixed(2),
      outcome: totals.outcome.toFixed(2),
      total: totals.total.toFixed(2),
    };
  }, [movements]);

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
        <Filters onFilter={handleFilter} tags={tags} isLoading={isLoading} />
        <MovementsTable movements={movements || []} onNewMovementButtonClick={onModalOpen}/>

        <NewMovementModal
          isOpen={isModalOpen} 
          onClose={onModalClose} 
          tags={tags}
          addTag={addTag}
        /> 
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

  let tags;

  try {
    const getFromApi = async (path: string) => {
      return api.get(path, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      }).then(response => response.data);
    }    
    
    tags = (await getFromApi('/tags/names')).map((tag: Tag) => ({ ...tag, selected: false }));
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
      tags,
    }
  }
}