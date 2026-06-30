package com.tiendagamer.backend.controller;

import com.tiendagamer.backend.model.Categoria;
import com.tiendagamer.backend.model.repository.CategoriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @PostMapping
    public Categoria guardarCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedCategorias() {
        String[] nombres = {"CPU", "GPU", "RAM", "ALMACENAMIENTO", "PLACA MADRE", "GABINETE", "FUENTE"};
        int creadas = 0;
        for (String nombre : nombres) {
            boolean existe = categoriaRepository.findAll().stream()
                .anyMatch(c -> c.getNombreCategoria().equalsIgnoreCase(nombre));
            if (!existe) {
                Categoria cat = new Categoria();
                cat.setNombreCategoria(nombre);
                categoriaRepository.save(cat);
                creadas++;
            }
        }
        return ResponseEntity.ok(Map.of("mensaje", "Categorías inicializadas", "creadas", creadas));
    }
}
