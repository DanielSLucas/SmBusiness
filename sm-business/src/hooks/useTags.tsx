import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getTags } from "../services/api";

export interface Tag {  
  id?: string;
  name: string;
  selected: boolean;
}

interface TagsContextData {
  tags: Tag[];
  addTag: (tagName: string) => void;
}

const TagsContext = createContext<TagsContextData>({} as TagsContextData);

interface TagsProviderProps {
  children: ReactNode;
}

export const TagsProvider: React.FC<TagsProviderProps> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags().then(apiTags => {
      setTags(apiTags.map(tag => ({ ...tag, selected: false })));
    })
  }, [])

  function addTag(tagName: string) {
    setTags(prev => [...prev, { name: tagName, selected: false }]);
  }

  return (
    <TagsContext.Provider value={{ tags, addTag }}>
      {children}
    </TagsContext.Provider>
  )
}

export function useTags(): TagsContextData {
  const context = useContext(TagsContext);

  if(!context) {
    throw new Error('useTags must be used within a TagsProvider');
  }

  return context;
}
