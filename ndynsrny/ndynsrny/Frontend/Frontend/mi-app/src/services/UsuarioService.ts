import type { Usuario } from "../types";
import { api } from "./api";

export const UsuarioService = {
  login: (email: string, password: string) =>
    api.post<Usuario>("/usuarios/login", { email, password }),
  registro: (nombre: string, email: string, password: string) =>
    api.post<Usuario>("/usuarios/registro", { nombre, email, password }),
  listar: () => api.get<Usuario[]>("/usuarios"),
  actualizarRol: (id: number, rol: string) =>
    api.put<Usuario>(`/usuarios/${id}/rol`, { rol }),
};
