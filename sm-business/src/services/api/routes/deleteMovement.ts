import { api } from "..";

export async function deleteMovement(id: number): Promise<void> {
  await api.delete(`/movements/${id}`);
}
