package com.tiendagamer.backend.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendagamer.backend.model.Carrito;
import com.tiendagamer.backend.model.Usuario;
import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuario(Usuario usuario);
}
