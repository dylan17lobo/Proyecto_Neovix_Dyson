package com.tiendagamer.backend.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendagamer.backend.model.PedidoProducto;
import com.tiendagamer.backend.model.Pedido;
import java.util.List;

public interface PedidoProductoRepository extends JpaRepository<PedidoProducto, Long> {
    List<PedidoProducto> findByPedido(Pedido pedido);
}
