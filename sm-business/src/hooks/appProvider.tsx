import { ReactNode } from "react";
import { NewMovementModalProvider } from "./useNewMovementModal";
import { TagsProvider } from "./useTags";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps>  = ({ children }) => {
  return (
    <TagsProvider>
      <NewMovementModalProvider>
        {children}
      </NewMovementModalProvider>
    </TagsProvider>
  )
}
