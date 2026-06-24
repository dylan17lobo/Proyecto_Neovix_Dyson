import type { Producto } from "../types";
import { api } from "./api";

export const ProductoService = {
  listar: () => api.get<Producto[]>("/productos"),
  obtener: (id: number) => api.get<Producto>(`/productos/${id}`),
  guardar: (p: Partial<Producto>) => api.post<Producto>("/productos", p),
  actualizar: (id: number, p: Partial<Producto>) =>
    api.put<Producto>(`/productos/${id}`, p),
  eliminar: (id: number) => api.del<void>(`/productos/${id}`),
  ajustarStock: (id: number, cantidad: number) =>
    api.patch<{ mensaje: string; stock: number }>(`/productos/${id}/stock`, { cantidad }),
};
