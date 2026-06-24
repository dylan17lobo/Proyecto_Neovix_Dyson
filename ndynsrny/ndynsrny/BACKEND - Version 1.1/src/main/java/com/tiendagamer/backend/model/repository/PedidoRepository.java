package com.tiendagamer.backend.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendagamer.backend.model.Pedido;
import com.tiendagamer.backend.model.Usuario;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioOrderByFechaDesc(Usuario usuario);
}
