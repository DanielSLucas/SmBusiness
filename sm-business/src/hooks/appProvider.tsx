import { ReactNode } from "react";

import { GlobalDisclosureProvider } from "./useGlobalDisclosure";
import { TagsProvider } from "./useTags";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps>  = ({ children }) => {
  return (
    <TagsProvider>
      <GlobalDisclosureProvider>
        {children}
      </GlobalDisclosureProvider>
    </TagsProvider>
  )
}
