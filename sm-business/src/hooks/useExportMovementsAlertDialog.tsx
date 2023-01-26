import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { createContext, ReactNode, useContext } from "react";

type ExportMovementsAlertDialogContextData = UseDisclosureReturn;

const ExportMovementsAlertDialogContext = createContext({} as ExportMovementsAlertDialogContextData);

interface ExportMovementsAlertDialogProviderProps {
  children: ReactNode;
}

export function ExportMovementsAlertDialogProvider({ children }: ExportMovementsAlertDialogProviderProps) {
  const disclosure = useDisclosure();  

  return(
    <ExportMovementsAlertDialogContext.Provider value={disclosure}>
      {children}
    </ExportMovementsAlertDialogContext.Provider>
  )
}

export const useExportMovementsAlertDialog = () => {
  const context = useContext(ExportMovementsAlertDialogContext);

  if(!context) {
    throw new Error('useExportMovementsAlertDialog must be used within a ExportMovementsAlertDialogProvider');
  }

  return context;
}
