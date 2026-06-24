import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthCtx } from "../contexts/AuthContext";

export function LoginRegister() {
  const [esLogin, setEsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, registro } = useAuthCtx();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (esLogin) {
        await login(email, password);
      } else {
        await registro(nombre, email, password);
      }
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#0B0F19] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#111625] border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          <h2 className="text-2xl font-bold text-white text-center tracking-wide mb-8 uppercase">
            {esLogin ? "INICIAR SESIÓN" : "REGISTRARSE"}
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!esLogin && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block ml-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                placeholder="email@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block ml-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 shadow-[0_0_25px_rgba(0,219,233,0.25)] mt-2"
            >
              {loading ? "CARGANDO..." : esLogin ? "INICIAR SESIÓN" : "REGISTRARSE"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8 pt-6 border-t border-white/5">
            {esLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => { setEsLogin(!esLogin); setError(""); }}
              className="text-cyan-400 hover:underline font-semibold cursor-pointer bg-transparent border-none text-sm p-0 ml-1"
            >
              {esLogin ? "Registrarse" : "Iniciar sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}