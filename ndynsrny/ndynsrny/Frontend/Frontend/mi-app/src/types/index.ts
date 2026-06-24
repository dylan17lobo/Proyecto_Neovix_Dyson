export interface Producto {
  idProducto: number;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  marca: string;
  categoria: Categoria | null;
}

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  password?: string;
  rol: string;
  fechaRegistro: string;
}

export interface Carrito {
  idCarrito: number;
  usuario: Usuario;
  fechaCreacion: string;
}

export interface CarritoProducto {
  id: number;
  carrito: Carrito;
  producto: Producto;
  cantidad: number;
}

export interface Pedido {
  idPedido: number;
  usuario: Usuario;
  fecha: string;
  total: number;
  estado: string;
}

export interface PedidoProducto {
  id: number;
  pedido: Pedido;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}
