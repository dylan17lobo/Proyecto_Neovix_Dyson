import type { Categoria } from "../types";
import { api } from "./api";

export const CategoriaService = {
  listar: () => api.get<Categoria[]>("/categorias"),
  seed: () => api.post<{ mensaje: string; creadas: number }>("/categorias/seed", {}),
};
