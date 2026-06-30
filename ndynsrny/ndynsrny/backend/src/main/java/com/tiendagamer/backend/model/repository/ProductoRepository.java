package com.tiendagamer.backend.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendagamer.backend.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

}