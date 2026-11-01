package com.polerialatina.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "recetas")
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto; // Ej: 1/4 de Pollo

    @ManyToOne
    @JoinColumn(name = "insumo_id")
    private Insumo insumo; // Ej: Papa, Pollo entero

    private double cantidadNecesaria; // Ej: 0.350 (kg de papa) o 0.25 (de pollo)

    // Constructores, Getters y Setters
    public Receta() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Insumo getInsumo() { return insumo; }
    public void setInsumo(Insumo insumo) { this.insumo = insumo; }

    public double getCantidadNecesaria() { return cantidadNecesaria; }
    public void setCantidadNecesaria(double cantidadNecesaria) { this.cantidadNecesaria = cantidadNecesaria; }
}