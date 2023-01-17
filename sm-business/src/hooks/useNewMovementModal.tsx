import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { createContext, ReactNode, useContext } from "react";

type NewMovementModalContextData = UseDisclosureReturn;

const NewMovementModalContext = createContext({} as NewMovementModalContextData);

interface NewMovementModalProviderProps {
  children: ReactNode;
}

export function NewMovementModalProvider({ children }: NewMovementModalProviderProps) {
  const disclosure = useDisclosure();  

  return(
    <NewMovementModalContext.Provider value={disclosure}>
      {children}
    </NewMovementModalContext.Provider>
  )
}

export const useNewMovementModal = () => {
  const context = useContext(NewMovementModalContext);

  if(!context) {
    throw new Error('useNewMovementModal must be used within a NewMovementModalProvider');
  }

  return context;
}
