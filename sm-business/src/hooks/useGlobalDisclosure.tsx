import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { createContext, ReactNode, useContext } from "react";

type GlobalDisclosureContextData = {
  exportMovementsAlertDialog: UseDisclosureReturn;
  importMovementsModal: UseDisclosureReturn;
  newMovementModal: UseDisclosureReturn;
};

const GlobalDisclosureContext = createContext({} as GlobalDisclosureContextData);

interface GlobalDisclosureProviderProps {
  children: ReactNode;
}

export function GlobalDisclosureProvider({ children }: GlobalDisclosureProviderProps) {
  const exportMovementsAlertDialog = useDisclosure();
  const importMovementsModal = useDisclosure();
  const newMovementModal = useDisclosure();

  return(
    <GlobalDisclosureContext.Provider value={{
      exportMovementsAlertDialog,
      importMovementsModal,
      newMovementModal,
    }}>
      {children}
    </GlobalDisclosureContext.Provider>
  )
}

export const useGlobalDisclosure = (id: keyof GlobalDisclosureContextData) => {
  const { [id]: context } = useContext(GlobalDisclosureContext);

  if(!context) {
    throw new Error('useGlobalDisclosure must be used within a GlobalDisclosureProvider');
  }

  return context;
}
