import { api } from "..";

export async function importMovements(file: File): Promise<void> {
  const data = new FormData();

  data.append('file', file);

  await api.post('/movements/import', data);
}
