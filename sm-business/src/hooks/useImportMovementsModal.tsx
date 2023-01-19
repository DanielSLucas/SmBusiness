import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { createContext, ReactNode, useContext } from "react";

type ImportMovementsModalContextData = UseDisclosureReturn;

const ImportMovementsModalContext = createContext({} as ImportMovementsModalContextData);

interface ImportMovementsModalProviderProps {
  children: ReactNode;
}

export function ImportMovementsModalProvider({ children }: ImportMovementsModalProviderProps) {
  const disclosure = useDisclosure();  

  return(
    <ImportMovementsModalContext.Provider value={disclosure}>
      {children}
    </ImportMovementsModalContext.Provider>
  )
}

export const useImportMovementsModal = () => {
  const context = useContext(ImportMovementsModalContext);

  if(!context) {
    throw new Error('useImportMovementsModal must be used within a ImportMovementsModalProvider');
  }

  return context;
}
