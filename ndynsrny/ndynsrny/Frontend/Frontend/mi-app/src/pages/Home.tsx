import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductoService } from "../services/ProductoService";
import { CategoriaService } from "../services/CategoriaService";
import type { Producto, Categoria } from "../types";

// Banco de imágenes profesionales de hardware según categorías comunes para el fondo de las tarjetas
const CATEGORIA_IMAGES: Record<string, string> = {
  "cpu": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=600&auto=format&fit=crop",
  "gpu": "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600&auto=format&fit=crop",
  "ram": "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=600&auto=format&fit=crop",
  "almacenamiento": "https://images.unsplash.com/photo-1628546111811-9a746536bdfc?q=80&w=600&auto=format&fit=crop",
  "placa madre": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
  "gabinete": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?q=80&w=600&auto=format&fit=crop",
  "fuente": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop",
};

export function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ProductoService.listar(), CategoriaService.listar()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const bestsellers = productos.slice(0, 4);
  const nuevos = productos.slice(4, 8); // Ampliado a un máximo de 4 para mejor equilibrio en el grid

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-md">
        <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin" style={{ borderColor: "#00dbe9" }}></div>
        <p className="text-white font-label-md tracking-widest animate-pulse">CARGANDO ARQUITECTURA...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] text-white min-h-screen font-sans selection:bg-primary-container/30">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center px-6 lg:px-12 overflow-hidden border-b border-white/5">
        {/* Fondo decorativo tecnológico */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,219,233,0.12),transparent_45%)]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10" style={{ maxWidth: "1280px" }}>
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse shadow-[0_0_8px_#00dbe9]"></span>
              <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">QUANTUM-CORE ARCHITECTURE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              PRECISION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 italic">ENGINEERED</span> PERFORMANCE.
            </h1>
            <p className="text-base sm:text-lg text-slate-400 mx-auto lg:mx-0" style={{ maxWidth: "36rem" }}>
              Experience the next evolution of hardware. Neovix Dyson processors deliver surgical precision
              in computational workflows, designed for those who redefine the boundaries of possibility.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/configurador"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold tracking-wide rounded-lg no-underline inline-block transition-transform duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,219,233,0.3)] text-center"
              >
                CONFIGURE SYSTEM
              </Link>
              <Link
                to="/catalogo"
                className="px-8 py-4 border border-slate-700 font-semibold rounded-lg hover:bg-white/5 hover:border-cyan-500/50 transition-all duration-300 no-underline inline-block text-center"
              >
                VIEW BLUEPRINTS
              </Link>
            </div>
          </div>
          {/* Gráfico/Elemento visual en el lado derecho */}
          <div className="hidden lg:flex justify-center relative">
            <div className="w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 rounded-2xl border border-white/10 p-6 flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-cyan-400/20 font-mono text-[160px] select-none">NX</span>
              <div className="absolute inset-0 border border-cyan-400/20 rounded-2xl scale-105 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CATEGORIES */}
      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white mb-2">CORE CATEGORIES</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-transparent mx-auto sm:mx-0"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((cat) => {
              const normalName = cat.nombreCategoria.toLowerCase();
              const bgImg = CATEGORIA_IMAGES[normalName] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop";

              return (
                <Link
                  key={cat.idCategoria}
                  to={`/catalogo?categoria=${cat.idCategoria}`}
                  className="group relative h-48 overflow-hidden rounded-xl border border-white/10 hover:border-cyan-500/50 no-underline transition-all duration-500 shadow-lg"
                >
                  {/* Imagen de fondo con Zoom */}
                  <img 
                    src={bgImg} 
                    alt={cat.nombreCategoria} 
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700"
                  />
                  {/* Capa oscura interna */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>
                  
                  {/* Contenido */}
                  <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center z-10">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-cyan-400 block mb-1">CATEGORÍA</span>
                      <h3 className="text-xl font-bold tracking-wide text-white group-hover:text-cyan-300 transition-colors">{cat.nombreCategoria}</h3>
                    </div>
                    <div className="w-10 h-10 bg-white/5 border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-400 rounded-lg flex items-center justify-center transition-all duration-300 text-white group-hover:text-slate-950">
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      {bestsellers.length > 0 && (
        <section className="py-20 px-6 lg:px-12 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white">BESTSELLERS</h2>
                <p className="text-slate-400 text-sm mt-1">Battle-tested by the world's elite builders.</p>
              </div>
              <Link to="/catalogo" className="text-sm font-bold tracking-wider text-cyan-400 hover:text-cyan-300 no-underline border-b border-cyan-400/20 pb-1 hover:border-cyan-300 transition-colors">
                VIEW ALL PRODUCTS
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((p) => (
                <Link
                  key={p.idProducto}
                  to={`/producto/${p.idProducto}`}
                  className="group relative bg-[#111625] border border-white/5 hover:border-cyan-500/40 rounded-xl p-5 no-underline flex flex-col h-full transition-all duration-500 hover:-translate-y-2 shadow-xl"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-slate-900/50 flex items-center justify-center border border-white/5">
                    {p.imagenUrl ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.imagenUrl} alt={p.nombreProducto} />
                    ) : (
                      <div className="text-slate-600 text-5xl font-mono select-none">[HW]</div>
                    )}
                    
                    <div className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded tracking-widest shadow-md ${
                      p.stock > 0 ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {p.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                    </div>
                  </div>

                  <div className="flex-grow space-y-1">
                    <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase block">{p.marca}</span>
                    <h4 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{p.nombreProducto}</h4>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-2xl font-black text-white">${p.precio.toFixed(2)}</span>
                    <span className="text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                      VER MÁS <span>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {nuevos.length > 0 && (
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white whitespace-nowrap">NEW ARRIVALS</h2>
              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nuevos.map((p) => (
                <Link
                  key={p.idProducto}
                  to={`/producto/${p.idProducto}`}
                  className="group relative h-72 rounded-xl overflow-hidden border border-white/5 hover:border-cyan-500/30 bg-gradient-to-br from-[#121826] to-[#0d121f] no-underline flex flex-col justify-between p-8 transition-all duration-500"
                >
                  <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    {p.imagenUrl && <img src={p.imagenUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  
                  <div className="relative z-10 space-y-2 max-w-sm">
                    <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase block">{p.marca}</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">{p.nombreProducto}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 pt-1">{p.descripcion}</p>
                  </div>
                  
                  <div className="relative z-10 flex justify-between items-center mt-4">
                    <span className="text-2xl font-black text-cyan-400">${p.precio.toFixed(2)}</span>
                    <span className="text-xs font-bold tracking-widest text-white group-hover:text-cyan-300 flex items-center gap-2 transition-colors">
                      VIEW DETAILS <span className="transition-transform group-hover:translate-x-2">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}