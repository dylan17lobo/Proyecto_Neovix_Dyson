package com.tiendagamer.backend.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendagamer.backend.model.CarritoProducto;
import com.tiendagamer.backend.model.Carrito;
import java.util.List;

public interface CarritoProductoRepository extends JpaRepository<CarritoProducto, Long> {
    List<CarritoProducto> findByCarrito(Carrito carrito);
    void deleteByCarrito(Carrito carrito);
}
