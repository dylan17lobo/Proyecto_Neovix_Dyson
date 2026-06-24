import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductoService } from "../services/ProductoService";
import { CarritoService } from "../services/CarritoService";
import { useAuthCtx } from "../contexts/AuthContext";
import type { Producto } from "../types";

export function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuthCtx();

  useEffect(() => {
    if (id) {
      ProductoService.obtener(Number(id))
        .then(setProducto)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const agregarAlCarrito = async () => {
    if (!usuario) {
      alert("Inicia sesión para agregar productos al carrito");
      return;
    }
    if (!producto) return;
    try {
      await CarritoService.agregar(usuario.idUsuario, producto.idProducto);
      alert("Producto agregado al carrito");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-[#0B0F19] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
        <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-[80vh] bg-[#0B0F19] flex flex-col items-center justify-center text-center px-6 py-12">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
        <h2 className="text-xl font-bold text-white tracking-wide uppercase">Producto no encontrado</h2>
        <Link to="/catalogo" className="mt-6 px-6 py-3 border border-slate-700 hover:border-cyan-500 text-cyan-400 font-semibold text-xs tracking-wider rounded-xl transition-all no-underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-6 lg:px-12">
      <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
        
        {/* Botón de retorno */}
        <Link to="/catalogo" className="text-xs font-bold tracking-wider text-cyan-400 hover:text-cyan-300 no-underline inline-flex items-center gap-2 mb-10 transition-colors uppercase">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al catálogo
        </Link>

        {/* Retícula de contenido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Contenedor de la Imagen */}
          <div className="bg-[#111625] border border-white/10 rounded-2xl p-8 flex items-center justify-center min-h-[400px] md:min-h-[450px] shadow-xl">
            {producto.imagenUrl ? (
              <img className="max-w-full max-h-[400px] object-contain rounded-xl" src={producto.imagenUrl} alt={producto.nombreProducto} />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600">
                <span className="material-symbols-outlined text-8xl">memory</span>
                <span className="text-xs font-mono mt-2">[Sin Imagen]</span>
              </div>
            )}
          </div>

          {/* Información y especificaciones */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">{producto.marca}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">{producto.nombreProducto}</h1>
            </div>

            {/* Precio */}
            <div className="text-4xl font-bold text-white font-mono bg-[#111625] border border-white/5 w-fit px-6 py-2.5 rounded-xl">
              ${producto.precio.toFixed(2)}
            </div>

            {/* Badge de disponibilidad */}
            <div>
              <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase border ${
                producto.stock > 0 
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${producto.stock > 0 ? "bg-cyan-400 animate-pulse" : "bg-red-500"}`}></span>
                {producto.stock > 0 ? `En stock (${producto.stock} unidades)` : "Agotado"}
              </span>
            </div>

            {/* Descripción */}
            <div className="pt-4 border-t border-white/10">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase block mb-2">Descripción</span>
              <p className="text-slate-300 text-sm leading-relaxed">{producto.descripcion}</p>
            </div>

            {/* Categoría */}
            {producto.categoria && (
              <div className="bg-[#111625] border border-white/10 rounded-xl p-4 flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-400 uppercase text-xs">Categoría</span>
                <span className="font-bold text-cyan-400 uppercase tracking-wide">{producto.categoria.nombreCategoria}</span>
              </div>
            )}

            {/* Botón de compra */}
            <button
              onClick={agregarAlCarrito}
              disabled={producto.stock === 0}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold tracking-wide text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(0,219,233,0.2)]"
            >
              {producto.stock > 0 ? "AGREGAR AL CARRITO" : "SIN STOCK DISPONIBLE"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}