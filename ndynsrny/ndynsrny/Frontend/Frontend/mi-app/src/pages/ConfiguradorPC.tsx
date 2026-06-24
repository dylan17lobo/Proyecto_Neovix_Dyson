import { useEffect, useState } from "react";
import { ProductoService } from "../services/ProductoService";
import { CategoriaService } from "../services/CategoriaService";
import type { Producto, Categoria } from "../types";
import { useAuthCtx } from "../contexts/AuthContext";
import { CarritoService } from "../services/CarritoService";

const PASOS = ["CPU", "GPU", "RAM", "ALMACENAMIENTO", "PLACA MADRE", "GABINETE", "FUENTE"];

interface Seleccion {
  [categoria: string]: Producto | null;
}

export function ConfiguradorPC() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [paso, setPaso] = useState(0);
  const [seleccion, setSeleccion] = useState<Seleccion>({});
  const { usuario } = useAuthCtx();

  useEffect(() => {
    // Primero asegurar que existan las categorías base
    CategoriaService.seed().catch(console.error);
    Promise.all([ProductoService.listar(), CategoriaService.listar()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(console.error);
  }, []);

  const catActual = PASOS[paso];
  // Buscar categoría con matching flexible (contiene el nombre del paso o viceversa)
  const catEntity = categorias.find(
    (c) =>
      c.nombreCategoria.toUpperCase().includes(catActual) ||
      catActual.includes(c.nombreCategoria.toUpperCase())
  );
  const prodsFiltrados = catEntity
    ? productos.filter((p) => p.categoria?.idCategoria === catEntity.idCategoria && p.stock > 0)
    : [];

  const seleccionar = (p: Producto) => {
    setSeleccion((prev) => ({ ...prev, [catActual]: p }));
    if (paso < PASOS.length - 1) {
      setPaso(paso + 1);
    }
  };

  const total = Object.values(seleccion).reduce(
    (sum, p) => sum + (p?.precio ?? 0),
    0
  );

  const agregarTodoAlCarrito = async () => {
    if (!usuario) {
      alert("Inicia sesión para agregar al carrito");
      return;
    }
    for (const p of Object.values(seleccion)) {
      if (p) {
        await CarritoService.agregar(usuario.idUsuario, p.idProducto);
      }
    }
    alert("Componentes agregados al carrito");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-6 lg:px-12">
      <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
        
        {/* ENCABEZADO */}
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-widest text-white mb-2 uppercase italic">Configurador PC</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        </div>

        {/* NAVEGACIÓN DE PASOS */}
        <div className="flex flex-wrap gap-2 mb-10 bg-[#111625] p-2 rounded-2xl border border-white/5">
          {PASOS.map((p, i) => (
            <button
              key={p}
              onClick={() => setPaso(i)}
              className={`flex-1 min-w-[120px] text-center py-3 px-4 rounded-xl text-[10px] font-bold tracking-widest transition-all duration-300 uppercase cursor-pointer border ${
                i === paso
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,219,233,0.3)]"
                  : seleccion[p]
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* SELECCIÓN DE PRODUCTOS */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="text-cyan-400 font-mono">0{paso + 1}.</span> 
              Selecciona {catActual}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prodsFiltrados.map((p) => (
                <button
                  key={p.idProducto}
                  onClick={() => seleccionar(p)}
                  className={`group text-left bg-[#111625] border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-40 ${
                    seleccion[catActual]?.idProducto === p.idProducto
                      ? "border-cyan-500 shadow-[0_0_20px_rgba(0,219,233,0.1)]"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">{p.marca}</span>
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">{p.nombreProducto}</h4>
                  </div>
                  <div className="mt-4 flex justify-between items-end border-t border-white/5 pt-3">
                    <span className="text-xl font-black text-white font-mono">${p.precio.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">SELECCIONAR →</span>
                  </div>
                </button>
              ))}
              
              {prodsFiltrados.length === 0 && (
                <div className="col-span-2 py-12 bg-[#111625] rounded-2xl border border-dashed border-white/10 text-center">
                  <p className="text-slate-500 text-sm font-medium">No hay componentes disponibles para este módulo.</p>
                </div>
              )}
            </div>
          </div>

          {/* RESUMEN LATERAL (STICKY) */}
          <div className="bg-[#111625] border border-white/10 rounded-2xl p-8 sticky top-6 shadow-2xl">
            <h3 className="text-lg font-black text-white mb-6 tracking-widest uppercase border-b border-white/5 pb-4">Tu Configuración</h3>
            
            <div className="space-y-4 mb-8">
              {PASOS.map((p) => {
                const prod = seleccion[p];
                return (
                  <div key={p} className="flex flex-col gap-1 border-b border-white/[0.03] pb-3">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{p}</span>
                    <span className={`text-xs font-bold transition-colors ${prod ? "text-cyan-300" : "text-slate-700"}`}>
                      {prod ? prod.nombreProducto : "Slot Vacío"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-end mb-8">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Estimado</span>
              <span className="text-3xl font-black text-white font-mono">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={agregarTodoAlCarrito}
              disabled={Object.keys(seleccion).length === 0}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black tracking-widest text-xs rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:grayscale shadow-[0_0_25px_rgba(0,219,233,0.2)]"
            >
              FINALIZAR Y COMPRAR
            </button>
            <p className="text-[9px] text-slate-500 text-center mt-4 uppercase tracking-tighter">Sujeto a disponibilidad de stock</p>
          </div>

        </div>
      </div>
    </div>
  );
}