import { api } from "..";

interface Tag {
  id: string;
  name: string;
}

export async function getTags() {
  return (await api.get<Tag[]>('/tags/names')).data;
}
