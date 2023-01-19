import { ReactNode } from "react";
import { ImportMovementsModalProvider } from "./useImportMovementsModal";
import { NewMovementModalProvider } from "./useNewMovementModal";
import { TagsProvider } from "./useTags";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps>  = ({ children }) => {
  return (
    <TagsProvider>
      <NewMovementModalProvider>
        <ImportMovementsModalProvider>
          {children}
        </ImportMovementsModalProvider>
      </NewMovementModalProvider>
    </TagsProvider>
  )
}
