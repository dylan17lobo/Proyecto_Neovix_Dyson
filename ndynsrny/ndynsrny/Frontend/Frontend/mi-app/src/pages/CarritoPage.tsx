import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CarritoService } from "../services/CarritoService";
import { PedidoService } from "../services/PedidoService";
import { useAuthCtx } from "../contexts/AuthContext";
import type { CarritoProducto } from "../types";

export function CarritoPage() {
  const { usuario } = useAuthCtx();
  const [items, setItems] = useState<CarritoProducto[]>([]);
  const [, setLoading] = useState(true);

  const cargar = () => {
    if (!usuario) {
      setLoading(false);
      return;
    }
    CarritoService.obtener(usuario.idUsuario)
      .then((data) => setItems(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, [usuario]);

  const actualizarCantidad = async (idItem: number, cantidad: number) => {
    if (cantidad < 1) return;
    try {
      await CarritoService.actualizarCantidad(idItem, cantidad);
      cargar();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  const eliminarItem = async (idItem: number) => {
    try {
      await CarritoService.eliminar(idItem);
      cargar();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  const crearPedido = async () => {
    if (!usuario) return;
    try {
      const res = await PedidoService.crear(usuario.idUsuario);
      alert(`Compra realizada con éxito. Pedido #${res.idPedido}`);
      cargar();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error al procesar la compra");
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-[80vh] bg-[#0B0F19] flex flex-col items-center justify-center text-center px-6 py-12">
        <span className="material-symbols-outlined text-6xl text-slate-500 mb-4">shopping_cart</span>
        <p className="text-slate-400 text-sm font-medium">Inicia sesión para ver tu carrito</p>
        <Link to="/login" className="mt-6 px-6 py-3 bg-[#111625] border border-white/10 hover:border-cyan-500 text-cyan-400 font-bold text-xs tracking-wider rounded-xl transition-all no-underline uppercase">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-6 lg:px-12">
      <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
        
        {/* Encabezado */}
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-widest text-white mb-2 uppercase italic">Carrito</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        </div>

        {items.length === 0 ? (
          <div className="py-20 bg-[#111625] rounded-2xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">shopping_cart</span>
            <p className="text-slate-400 text-sm font-medium">Tu carrito está vacío</p>
            <Link to="/catalogo" className="mt-6 text-xs font-bold tracking-wider text-cyan-400 hover:text-cyan-300 no-underline uppercase">
              Explorar productos →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Lista de Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-[#111625] border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-xl">
                  
                  {/* Info e Imagen del Producto */}
                  <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-xl bg-[#0B0F19] border border-white/5 flex items-center justify-center shrink-0 p-2">
                      {item.producto.imagenUrl ? (
                        <img className="max-w-full max-h-full object-contain rounded-lg" src={item.producto.imagenUrl} alt={item.producto.nombreProducto} />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-slate-600">memory</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link to={`/producto/${item.producto.idProducto}`} className="font-bold text-white hover:text-cyan-400 transition-colors no-underline block truncate">
                        {item.producto.nombreProducto}
                      </Link>
                      <p className="text-xs font-mono text-slate-400 mt-1">${item.producto.precio.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Controles y precio final */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                    
                    {/* Selector de cantidad */}
                    <div className="flex items-center bg-[#0B0F19] border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="w-8 h-8 rounded-lg bg-[#111625] hover:bg-white/5 text-white flex items-center justify-center transition-colors cursor-pointer border-none font-bold text-lg"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm text-white w-10 text-center font-bold">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="w-8 h-8 rounded-lg bg-[#111625] hover:bg-white/5 text-white flex items-center justify-center transition-colors cursor-pointer border-none font-bold text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal del item */}
                    <div className="font-mono font-bold text-white text-right w-24">
                      ${(item.producto.precio * item.cantidad).toFixed(2)}
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none p-1 flex items-center"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Panel de Resumen */}
            <div className="bg-[#111625] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-lg font-black tracking-widest text-white mb-6 uppercase border-b border-white/5 pb-4">Resumen</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-sm text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Envío</span>
                  <span className="font-mono text-xs text-cyan-400">Gratis</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-end mb-8">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-white font-mono">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={crearPedido}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black tracking-widest text-xs rounded-xl transition-all hover:opacity-90 active:scale-[0.98] shadow-[0_0_25px_rgba(0,219,233,0.2)]"
              >
                REALIZAR PEDIDO
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}