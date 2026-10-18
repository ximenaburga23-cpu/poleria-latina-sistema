package com.polerialatina.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "recetas")
@Data
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id")
    private Long productoId; // ID del plato (ej: 1/4 de Pollo)

    @ManyToOne
    @JoinColumn(name = "insumo_id")
    private Insumo insumo; // Insumo consumido (ej: Papa amarilla)

    @Column(name = "cantidad_consumida", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadConsumida; // Ej: 0.25 (kg)
}