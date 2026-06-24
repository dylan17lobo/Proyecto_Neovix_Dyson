import type { Pedido } from "../types";
import { api } from "./api";

export const PedidoService = {
  crear: (idUsuario: number) =>
    api.post<{ mensaje: string; idPedido: number }>("/pedidos/crear", {
      idUsuario,
    }),
  porUsuario: (idUsuario: number) =>
    api.get<Pedido[]>(`/pedidos/usuario/${idUsuario}`),
  listar: () => api.get<Pedido[]>("/pedidos"),
  actualizarEstado: (id: number, estado: string) =>
    api.put(`/pedidos/${id}/estado`, { estado }),
};
