package com.tiendagamer.backend.controller;

import com.tiendagamer.backend.model.*;
import com.tiendagamer.backend.model.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PedidoProductoRepository pedidoProductoRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoProductoRepository carritoProductoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/crear")
    public ResponseEntity<?> crearPedido(@RequestBody Map<String, Long> body) {
        Long idUsuario = body.get("idUsuario");

        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
        if (usuario == null) return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));

        Carrito carrito = carritoRepository.findByUsuario(usuario).orElse(null);
        if (carrito == null) return ResponseEntity.badRequest().body(Map.of("error", "Carrito vacío"));

        List<CarritoProducto> items = carritoProductoRepository.findByCarrito(carrito);
        if (items.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Carrito vacío"));

        double total = items.stream().mapToDouble(ip -> ip.getProducto().getPrecio() * ip.getCantidad()).sum();

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha(LocalDateTime.now());
        pedido.setTotal(total);
        pedido.setEstado("pendiente");
        pedido = pedidoRepository.save(pedido);

        for (CarritoProducto cp : items) {
            PedidoProducto pp = new PedidoProducto();
            pp.setPedido(pedido);
            pp.setProducto(cp.getProducto());
            pp.setCantidad(cp.getCantidad());
            pp.setPrecioUnitario(cp.getProducto().getPrecio());
            pedidoProductoRepository.save(pp);

            Producto p = cp.getProducto();
            p.setStock(p.getStock() - cp.getCantidad());
        }

        carritoProductoRepository.deleteByCarrito(carrito);

        return ResponseEntity.ok(Map.of("mensaje", "Pedido creado", "idPedido", pedido.getIdPedido()));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> pedidosPorUsuario(@PathVariable Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
        if (usuario == null) return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));

        List<Pedido> pedidos = pedidoRepository.findByUsuarioOrderByFechaDesc(usuario);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido == null) return ResponseEntity.badRequest().body(Map.of("error", "Pedido no encontrado"));

        pedido.setEstado(body.get("estado"));
        pedidoRepository.save(pedido);
        return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado"));
    }
}
