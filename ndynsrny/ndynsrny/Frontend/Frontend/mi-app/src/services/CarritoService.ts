import type { CarritoProducto } from "../types";
import { api } from "./api";

export const CarritoService = {
  obtener: (idUsuario: number) =>
    api.get<{ carrito: unknown; items: CarritoProducto[] }>(
      `/carrito/${idUsuario}`
    ),
  agregar: (idUsuario: number, idProducto: number, cantidad = 1) =>
    api.post("/carrito/agregar", { idUsuario, idProducto, cantidad }),
  actualizarCantidad: (idItem: number, cantidad: number) =>
    api.put("/carrito/actualizar", { idItem, cantidad }),
  eliminar: (idItem: number) => api.del(`/carrito/eliminar/${idItem}`),
};
