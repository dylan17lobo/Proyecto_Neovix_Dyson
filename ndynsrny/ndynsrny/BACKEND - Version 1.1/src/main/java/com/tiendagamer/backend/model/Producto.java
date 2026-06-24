package com.tiendagamer.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "productos")
@Getter
@Setter
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;

    private String nombreProducto;

    private String descripcion;

    private Double precio;

    private Integer stock;

    private String imagenUrl;

    private String marca;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    @JsonIgnoreProperties("productos")
    private Categoria categoria;
}