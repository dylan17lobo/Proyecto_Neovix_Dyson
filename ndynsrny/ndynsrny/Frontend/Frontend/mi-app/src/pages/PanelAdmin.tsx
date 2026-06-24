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
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await ProductoService.eliminar(id);
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

  if (usuario?.rol !== "admin") {
    return (
      <div className="text-center py-2xl">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">admin_panel_settings</span>
        <p className="font-body-md text-body-md text-on-surface-variant mt-md">Acceso restringido a administradores</p>
      </div>
    );
  }

  if (!usuario) return null;

  return (
    <div className="py-2xl px-2xl">
      <div className="container mx-auto" style={{ maxWidth: "1280px" }}>
        <div className="mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-white mb-base">PANEL ADMINISTRADOR</h2>
          <div className="w-24 h-1 bg-primary-container"></div>
        </div>

        <div className="flex gap-md mb-xl">
          {(["productos", "pedidos", "usuarios"] as Seccion[]).map((s) => (
            <button
              key={s}
              onClick={() => setSeccion(s)}
              className={`px-xl py-md rounded font-label-md text-label-md transition-colors cursor-pointer ${
                seccion === s
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:text-white"
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
              className="mb-md px-xl py-md bg-primary-container text-on-primary font-label-md text-label-md rounded-lg cursor-pointer"
            >
              + NUEVO PRODUCTO
            </button>

            {showForm && (
              <div className="glass-panel rounded-xl p-lg mb-lg">
                <h3 className="font-headline-md text-headline-md text-white mb-md">
                  {editProd.idProducto ? "EDITAR" : "NUEVO"} PRODUCTO
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <input
                    placeholder="Nombre"
                    value={editProd.nombreProducto || ""}
                    onChange={(e) => setEditProd({ ...editProd, nombreProducto: e.target.value })}
                    className="bg-surface-container-low border-b-2 border-primary-container/30 focus:border-primary-container text-white font-label-md py-md px-xl outline-none"
                  />
                  <input
                    placeholder="Marca"
                    value={editProd.marca || ""}
                    onChange={(e) => setEditProd({ ...editProd, marca: e.target.value })}
                    className="bg-surface-container-low border-b-2 border-primary-container/30 focus:border-primary-container text-white font-label-md py-md px-xl outline-none"
                  />
                  <input
                    placeholder="Precio"
                    type="number"
                    value={editProd.precio || ""}
                    onChange={(e) => setEditProd({ ...editProd, precio: Number(e.target.value) })}
                    className="bg-surface-container-low border-b-2 border-primary-container/30 focus:border-primary-container text-white font-label-md py-md px-xl outline-none"
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={editProd.stock ?? ""}
                    onChange={(e) => setEditProd({ ...editProd, stock: Number(e.target.value) })}
                    className="bg-surface-container-low border-b-2 border-primary-container/30 focus:border-primary-container text-white font-label-md py-md px-xl outline-none"
                  />
                  <input
                    placeholder="URL Imagen"
                    value={editProd.imagenUrl || ""}
                    onChange={(e) => setEditProd({ ...editProd, imagenUrl: e.target.value })}
                    className="bg-surface-container-low border-b-2 border-primary-container/30 focus:border-primary-container text-white font-label-md py-md px-xl outline-none"
                  />
                  <select
                    value={editProd.categoria?.idCategoria || ""}
                    onChange={(e) => {
                      const cat = categorias.find((c) => c.idCategoria === Number(e.target.value));
                      setEditProd({ ...editProd, categoria: cat || null });
                    }}
                    className="bg-surface-container-low border-b-2 border-primary-container/30 focus:border-primary-container text-white font-label-md py-md px-xl outline-none"
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((c) => (
                      <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
                    ))}
                  </select>
                  <div className="md:col-span-2">
                    <textarea
                      placeholder="Descripción"
                      value={editProd.descripcion || ""}
                      onChange={(e) => setEditProd({ ...editProd, descripcion: e.target.value })}
                      className="w-full bg-surface-container-low border-b-2 border-primary-container/30 focus:border-primary-container text-white font-label-md py-md px-xl outline-none"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-md mt-md">
                  <button onClick={guardarProducto} className="px-xl py-md bg-primary-container text-on-primary font-label-md text-label-md rounded-lg cursor-pointer">
                    GUARDAR
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-xl py-md bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-lg cursor-pointer">
                    CANCELAR
                  </button>
                </div>
              </div>
            )}

            <div className="glass-panel rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">ID</th>
                    <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">NOMBRE</th>
                    <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">PRECIO</th>
                    <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">STOCK</th>
                    <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.idProducto} className="border-b border-outline-variant/10">
                      <td className="p-md font-label-sm text-label-sm text-white">{p.idProducto}</td>
                      <td className="p-md font-label-sm text-label-sm text-white">{p.nombreProducto}</td>
                      <td className="p-md font-label-sm text-label-sm text-white">${p.precio.toFixed(2)}</td>
                      <td className="p-md font-label-sm text-label-sm text-white">{p.stock}</td>
                      <td className="p-md flex gap-sm">
                        <button
                          onClick={() => { setEditProd(p); setShowForm(true); }}
                          className="font-label-sm text-label-sm text-primary-container hover:underline cursor-pointer bg-transparent border-none"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(p.idProducto)}
                          className="font-label-sm text-label-sm text-error hover:underline cursor-pointer bg-transparent border-none"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {seccion === "pedidos" && (
          <div className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">ID</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">USUARIO</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">TOTAL</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">ESTADO</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">FECHA</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.idPedido} className="border-b border-outline-variant/10">
                    <td className="p-md font-label-sm text-label-sm text-white">#{p.idPedido}</td>
                    <td className="p-md font-label-sm text-label-sm text-white">{p.usuario?.nombre || "—"}</td>
                    <td className="p-md font-label-sm text-label-sm text-white">${p.total.toFixed(2)}</td>
                    <td className="p-md">
                      <span className={`font-label-sm text-label-sm px-sm py-xs rounded ${
                        p.estado === "pendiente" ? "bg-yellow-900/30 text-yellow-400" :
                        p.estado === "enviado" ? "bg-blue-900/30 text-blue-400" :
                        "bg-green-900/30 text-green-400"
                      }`}>{p.estado}</span>
                    </td>
                    <td className="p-md font-label-sm text-label-sm text-on-surface-variant">
                      {new Date(p.fecha).toLocaleDateString()}
                    </td>
                    <td className="p-md">
                      <select
                        value={p.estado}
                        onChange={(e) => cambiarEstadoPedido(p.idPedido, e.target.value)}
                        className="bg-surface-container-low border border-outline-variant/30 text-white font-label-sm text-label-sm px-sm py-xs rounded outline-none"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {seccion === "usuarios" && (
          <div className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">ID</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">NOMBRE</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">EMAIL</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">ROL</th>
                  <th className="text-left p-md font-label-sm text-label-sm text-on-surface-variant">REGISTRO</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.idUsuario} className="border-b border-outline-variant/10">
                    <td className="p-md font-label-sm text-label-sm text-white">{u.idUsuario}</td>
                    <td className="p-md font-label-sm text-label-sm text-white">{u.nombre}</td>
                    <td className="p-md font-label-sm text-label-sm text-white">{u.email}</td>
                    <td className="p-md font-label-sm text-label-sm text-white">
                      <span className={`font-label-sm text-label-sm px-sm py-xs rounded ${
                        u.rol === "admin" ? "bg-primary-container/20 text-primary-container" : "text-on-surface-variant"
                      }`}>{u.rol}</span>
                    </td>
                    <td className="p-md font-label-sm text-label-sm text-on-surface-variant">
                      {new Date(u.fechaRegistro).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
