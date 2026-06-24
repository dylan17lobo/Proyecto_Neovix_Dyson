package com.tiendagamer.backend.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendagamer.backend.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
