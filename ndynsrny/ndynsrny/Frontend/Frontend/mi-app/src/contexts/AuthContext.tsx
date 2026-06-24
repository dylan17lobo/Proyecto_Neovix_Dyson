import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Usuario } from "../types";

interface AuthCtx {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<Usuario>;
  registro: (nombre: string, email: string, password: string) => Promise<Usuario>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthCtx() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthCtx must be inside AuthProvider");
  return ctx;
}
