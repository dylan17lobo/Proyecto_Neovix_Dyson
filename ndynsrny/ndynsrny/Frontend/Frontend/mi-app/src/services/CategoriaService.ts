import type { Categoria } from "../types";
import { api } from "./api";

export const CategoriaService = {
  listar: () => api.get<Categoria[]>("/categorias"),
};
