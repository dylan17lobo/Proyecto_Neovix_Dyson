import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductoService } from "../services/ProductoService";
import { CategoriaService } from "../services/CategoriaService";
import type { Producto, Categoria } from "../types";
import { CarritoService } from "../services/CarritoService";
import { useAuthCtx } from "../contexts/AuthContext";

export function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSel, setCategoriaSel] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const { usuario } = useAuthCtx();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const catParam = searchParams.get("categoria");
    if (catParam) setCategoriaSel(Number(catParam));
  }, [searchParams]);

  useEffect(() => {
    Promise.all([ProductoService.listar(), CategoriaService.listar()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtrados = categoriaSel
    ? productos.filter((p) => p.categoria?.idCategoria === categoriaSel)
    : productos;

  const agregarAlCarrito = async (idProducto: number) => {
    if (!usuario) {
      alert("Autenticación requerida para acceder al buffer de compras.");
      return;
    }
    try {
      await CarritoService.agregar(usuario.idUsuario, idProducto);
      alert("Módulo añadido al carrito con éxito.");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error de sincronización");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse">Indexando Hardware...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-6 lg:px-12 selection:bg-cyan-500/30">
      <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
        
        {/* HEADER DE SECCIÓN */}
        <div className="mb-12">
          <h2 className="text-3xl font-black tracking-widest text-white mb-2 uppercase">System Inventory</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        </div>

        <div className="flex gap-10 flex-col lg:flex-row">
          
          {/* BARRA LATERAL - FILTROS */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-[#111625] border border-white/5 rounded-2xl p-6 sticky top-6 shadow-2xl">
              <h3 className="text-[11px] font-mono font-bold tracking-[0.2em] text-slate-500 uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-cyan-500 rounded-full"></span>
                Categorías
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCategoriaSel(null)}
                  className={`text-left text-xs font-bold tracking-widest px-4 py-3 rounded-xl transition-all duration-300 uppercase border ${
                    categoriaSel === null
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,219,233,0.1)]"
                      : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  All Blueprints
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.idCategoria}
                    onClick={() => setCategoriaSel(cat.idCategoria)}
                    className={`text-left text-xs font-bold tracking-widest px-4 py-3 rounded-xl transition-all duration-300 uppercase border ${
                      categoriaSel === cat.idCategoria
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,219,233,0.1)]"
                        : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat.nombreCategoria}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* GRID DE PRODUCTOS */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtrados.map((p) => (
                <div
                  key={p.idProducto}
                  className="group bg-[#111625] border border-white/5 hover:border-cyan-500/40 rounded-2xl p-5 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 shadow-xl relative"
                >
                  <Link to={`/producto/${p.idProducto}`} className="no-underline">
                    <div className="relative aspect-square mb-6 overflow-hidden rounded-xl bg-slate-900/50 flex items-center justify-center border border-white/5">
                      {p.imagenUrl ? (
                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={p.imagenUrl} alt={p.nombreProducto} />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-slate-700 select-none">memory</span>
                      )}
                      
                      {/* Badge de Stock */}
                      <div className={`absolute top-3 right-3 px-2.5 py-1 text-[9px] font-black tracking-widest rounded-md shadow-md border ${
                        p.stock > 0 
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" 
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {p.stock > 0 ? "IN STOCK" : "SOLD OUT"}
                      </div>
                    </div>

                    <div className="flex-grow space-y-2">
                      <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase block">{p.marca}</span>
                      <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight leading-snug">
                        {p.nombreProducto}
                      </h4>
                    </div>
                  </Link>

                  <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center">
                    <span className="text-2xl font-black text-white font-mono tracking-tighter">
                      ${p.precio.toFixed(2)}
                    </span>
                    <button
                      onClick={() => agregarAlCarrito(p.idProducto)}
                      disabled={p.stock === 0}
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-400 group/btn transition-all duration-300 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-white group-hover/btn:text-slate-950 transition-colors">
                        add_shopping_cart
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {filtrados.length === 0 && (
              <div className="bg-[#111625] border border-white/5 rounded-2xl py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-800 mb-4">inventory_2</span>
                <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No se detectaron módulos activos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}