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
@RequestMapping("/carrito")
public class CarritoController {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoProductoRepository carritoProductoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping("/{idUsuario}")
    public ResponseEntity<?> obtenerCarrito(@PathVariable Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
        if (usuario == null) return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));

        Carrito carrito = carritoRepository.findByUsuario(usuario)
                .orElseGet(() -> {
                    Carrito nuevo = new Carrito();
                    nuevo.setUsuario(usuario);
                    nuevo.setFechaCreacion(LocalDateTime.now());
                    return carritoRepository.save(nuevo);
                });

        List<CarritoProducto> items = carritoProductoRepository.findByCarrito(carrito);
        return ResponseEntity.ok(Map.of("carrito", carrito, "items", items));
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarProducto(@RequestBody Map<String, Long> body) {
        Long idUsuario = body.get("idUsuario");
        Long idProducto = body.get("idProducto");
        Integer cantidad = body.containsKey("cantidad") ? ((Number) body.get("cantidad")).intValue() : 1;

        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
        Producto producto = productoRepository.findById(idProducto).orElse(null);
        if (usuario == null || producto == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Usuario o producto no encontrado"));

        Carrito carrito = carritoRepository.findByUsuario(usuario)
                .orElseGet(() -> {
                    Carrito nuevo = new Carrito();
                    nuevo.setUsuario(usuario);
                    nuevo.setFechaCreacion(LocalDateTime.now());
                    return carritoRepository.save(nuevo);
                });

        List<CarritoProducto> existentes = carritoProductoRepository.findByCarrito(carrito);
        for (CarritoProducto cp : existentes) {
            if (cp.getProducto().getIdProducto().equals(idProducto)) {
                cp.setCantidad(cp.getCantidad() + cantidad);
                carritoProductoRepository.save(cp);
                return ResponseEntity.ok(Map.of("mensaje", "Cantidad actualizada"));
            }
        }

        CarritoProducto nuevo = new CarritoProducto();
        nuevo.setCarrito(carrito);
        nuevo.setProducto(producto);
        nuevo.setCantidad(cantidad);
        carritoProductoRepository.save(nuevo);

        return ResponseEntity.ok(Map.of("mensaje", "Producto agregado al carrito"));
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarCantidad(@RequestBody Map<String, Object> body) {
        Long idItem = ((Number) body.get("idItem")).longValue();
        Integer cantidad = ((Number) body.get("cantidad")).intValue();

        CarritoProducto cp = carritoProductoRepository.findById(idItem).orElse(null);
        if (cp == null) return ResponseEntity.badRequest().body(Map.of("error", "Item no encontrado"));

        cp.setCantidad(cantidad);
        carritoProductoRepository.save(cp);
        return ResponseEntity.ok(Map.of("mensaje", "Cantidad actualizada"));
    }

    @DeleteMapping("/eliminar/{idItem}")
    public ResponseEntity<?> eliminarItem(@PathVariable Long idItem) {
        carritoProductoRepository.deleteById(idItem);
        return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado del carrito"));
    }
}
