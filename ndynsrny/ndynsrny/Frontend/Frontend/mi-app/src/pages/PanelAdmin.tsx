import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductoService } from "../services/ProductoService";
import { PedidoService } from "../services/PedidoService";
import { UsuarioService } from "../services/UsuarioService";
import { CategoriaService } from "../services/CategoriaService";
import type { Producto, Pedido, Usuario, Categoria } from "../types";
import { useAuthCtx } from "../contexts/AuthContext";

type Seccion = "productos" | "pedidos" | "usuarios";

export function PanelAdmin() {
  const { usuario } = useAuthCtx();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState<Seccion>("productos");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [editProd, setEditProd] = useState<Partial<Producto>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (usuario && usuario.rol !== "admin") {
      navigate("/");
    }
  }, [usuario, navigate]);

  const cargarDatos = () => {
    ProductoService.listar().then(setProductos).catch(console.error);
    PedidoService.listar().then(setPedidos).catch(console.error);
    UsuarioService.listar().then(setUsuarios).catch(console.error);
    CategoriaService.listar().then(setCategorias).catch(console.error);
  };

  useEffect(() => {
    CategoriaService.seed().catch(console.error);
    cargarDatos();
  }, []);

  const guardarProducto = async () => {
    try {
      if (editProd.idProducto) {
        await ProductoService.actualizar(editProd.idProducto, editProd);
      } else {
        await ProductoService.guardar(editProd);
      }
      setShowForm(false);
      setEditProd({});
      cargarDatos();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm("Eliminar producto?")) return;
    try {
      await ProductoService.eliminar(id);
      cargarDatos();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  const ajustarStock = async (id: number, cantidad: number) => {
    try {
      await ProductoService.ajustarStock(id, cantidad);
      cargarDatos();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  const cambiarEstadoPedido = async (id: number, estado: string) => {
    try {
      await PedidoService.actualizarEstado(id, estado);
      cargarDatos();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  const cambiarRol = async (id: number, rol: string) => {
    try {
      await UsuarioService.actualizarRol(id, rol);
      cargarDatos();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  if (usuario?.rol !== "admin") {
    return (
      <div className="min-h-[80vh] bg-[#0B0F19] flex flex-col items-center justify-center text-center px-6 py-12">
        <span className="material-symbols-outlined text-6xl text-slate-500 mb-4">admin_panel_settings</span>
        <p className="text-slate-400 text-sm font-medium">Acceso restringido a administradores</p>
      </div>
    );
  }

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-6 lg:px-12">
      <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-widest text-white mb-2 uppercase italic">Panel 
          istrador</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        </div>

        <div className="flex gap-4 mb-10">
          {(["productos", "pedidos", "usuarios"] as Seccion[]).map((s) => (
            <button
              key={s}
              onClick={() => setSeccion(s)}
              className={`px-6 py-4 rounded-xl text-xs font-bold tracking-widest transition-all cursor-pointer uppercase border ${
                seccion === s
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,219,233,0.3)]"
                  : "bg-[#111625] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {s === "productos" ? "PRODUCTOS" : s === "pedidos" ? "PEDIDOS" : "USUARIOS"}
            </button>
          ))}
        </div>

        {seccion === "productos" && (
          <div>
            <button
              onClick={() => {
                setEditProd({});
                setShowForm(true);
              }}
              className="mb-6 px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black tracking-widest text-xs rounded-xl transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(0,219,233,0.2)]"
            >
              + NUEVO PRODUCTO
            </button>

            {showForm && (
              <div className="bg-[#111625] border border-white/10 rounded-2xl p-8 mb-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 uppercase">
                  {editProd.idProducto ? "EDITAR" : "NUEVO"} PRODUCTO
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="Nombre"
                    value={editProd.nombreProducto || ""}
                    onChange={(e) => setEditProd({ ...editProd, nombreProducto: e.target.value })}
                    className="bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                  />
                  <input
                    placeholder="Marca"
                    value={editProd.marca || ""}
                    onChange={(e) => setEditProd({ ...editProd, marca: e.target.value })}
                    className="bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                  />
                  <input
                    placeholder="Precio"
                    type="number"
                    value={editProd.precio || ""}
                    onChange={(e) => setEditProd({ ...editProd, precio: Number(e.target.value) })}
                    className="bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={editProd.stock ?? ""}
                    onChange={(e) => setEditProd({ ...editProd, stock: Number(e.target.value) })}
                    className="bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                  />
                  <input
                    placeholder="URL Imagen"
                    value={editProd.imagenUrl || ""}
                    onChange={(e) => setEditProd({ ...editProd, imagenUrl: e.target.value })}
                    className="bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                  />
                  <select
                    value={editProd.categoria?.idCategoria || ""}
                    onChange={(e) => {
                      const cat = categorias.find((c) => c.idCategoria === Number(e.target.value));
                      setEditProd({ ...editProd, categoria: cat || null });
                    }}
                    className="bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="">Sin categoria</option>
                    {categorias.map((c) => (
                      <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
                    ))}
                  </select>
                  <div className="md:col-span-2">
                    <textarea
                      placeholder="Descripcion"
                      value={editProd.descripcion || ""}
                      onChange={(e) => setEditProd({ ...editProd, descripcion: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-white/10 rounded-xl text-white text-sm py-3 px-4 outline-none focus:border-cyan-500 transition-colors"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={guardarProducto} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black tracking-widest text-xs rounded-xl transition-all hover:opacity-90 cursor-pointer">
                    GUARDAR
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-3 bg-[#0B0F19] border border-white/10 text-slate-400 font-black tracking-widest text-xs rounded-xl hover:text-white cursor-pointer">
                    CANCELAR
                  </button>
                </div>
              </div>
            )}

            <div className="bg-[#111625] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                    <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">NOMBRE</th>
                    <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">PRECIO</th>
                    <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">STOCK</th>
                    <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.idProducto} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-xs font-mono text-slate-400">{p.idProducto}</td>
                      <td className="p-4 text-xs font-bold text-white">{p.nombreProducto}</td>
                      <td className="p-4 text-xs font-mono text-white">${p.precio.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => ajustarStock(p.idProducto, -1)}
                            className="w-7 h-7 rounded-lg bg-[#0B0F19] hover:bg-red-900/30 text-red-400 flex items-center justify-center transition-colors cursor-pointer border border-white/10 font-bold text-sm"
                            title="Restar 1"
                          >
                            -
                          </button>
                          <span className="font-mono text-sm text-white w-8 text-center font-bold">{p.stock}</span>
                          <button
                            onClick={() => ajustarStock(p.idProducto, 1)}
                            className="w-7 h-7 rounded-lg bg-[#0B0F19] hover:bg-green-900/30 text-green-400 flex items-center justify-center transition-colors cursor-pointer border border-white/10 font-bold text-sm"
                            title="Sumar 1"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setEditProd(p); setShowForm(true); }}
                            className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer bg-transparent border-none tracking-widest uppercase"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(p.idProducto)}
                            className="text-[10px] font-bold text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none tracking-widest uppercase"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">No hay productos registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {seccion === "pedidos" && (
          <div className="bg-[#111625] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">USUARIO</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOTAL</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ESTADO</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">FECHA</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ACCION</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.idPedido} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-400">#{p.idPedido}</td>
                    <td className="p-4 text-xs font-bold text-white">{p.usuario?.nombre || "-"}</td>
                    <td className="p-4 text-xs font-mono text-white">${p.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        p.estado === "pendiente" ? "bg-yellow-900/30 text-yellow-400" :
                        p.estado === "enviado" ? "bg-blue-900/30 text-blue-400" :
                        p.estado === "entregado" ? "bg-green-900/30 text-green-400" :
                        "bg-red-900/30 text-red-400"
                      }`}>{p.estado}</span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(p.fecha).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={p.estado}
                        onChange={(e) => cambiarEstadoPedido(p.idPedido, e.target.value)}
                        className="bg-[#0B0F19] border border-white/10 text-white text-xs px-2 py-1 rounded outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {pedidos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">No hay pedidos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {seccion === "usuarios" && (
          <div className="bg-[#111625] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">NOMBRE</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">EMAIL</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ROL</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">REGISTRO</th>
                  <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ACCION</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.idUsuario} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-400">{u.idUsuario}</td>
                    <td className="p-4 text-xs font-bold text-white">{u.nombre}</td>
                    <td className="p-4 text-xs text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        u.rol === "admin" ? "bg-cyan-900/30 text-cyan-400" : "text-slate-400"
                      }`}>{u.rol}</span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(u.fechaRegistro).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={u.rol}
                        onChange={(e) => cambiarRol(u.idUsuario, e.target.value)}
                        className="bg-[#0B0F19] border border-white/10 text-white text-xs px-2 py-1 rounded outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="cliente">Cliente</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">No hay usuarios registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
