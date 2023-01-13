import { ReactNode } from "react";
import { TagsProvider } from "./useTags";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps>  = ({ children }) => {
  return (
    <TagsProvider>
      {children}
    </TagsProvider>
  )
}
