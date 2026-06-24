import { useState, useEffect, useCallback } from "react";
import type { Usuario } from "../types";
import { UsuarioService } from "../services/UsuarioService";

const USER_KEY = "neovix_usuario";

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [usuario]);

  const login = useCallback(async (email: string, password: string) => {
    const user = await UsuarioService.login(email, password);
    setUsuario(user);
    return user;
  }, []);

  const registro = useCallback(
    async (nombre: string, email: string, password: string) => {
      const user = await UsuarioService.registro(nombre, email, password);
      setUsuario(user);
      return user;
    },
    []
  );

  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  return { usuario, login, registro, logout };
}
