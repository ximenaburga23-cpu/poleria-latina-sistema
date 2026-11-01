package com.polerialatina.backend.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "trabajadores")
public class Trabajador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;        // Ej: María (Moza)
    private String puesto;        // Ej: Moza / Cajera / Cocina
    private BigDecimal sueldoSemanal; // Ej: 100.00

    // Constructores, Getters y Setters
    public Trabajador() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getPuesto() { return puesto; }
    public void setPuesto(String puesto) { this.puesto = puesto; }

    public BigDecimal getSueldoSemanal() { return sueldoSemanal; }
    public void setSueldoSemanal(BigDecimal sueldoSemanal) { this.sueldoSemanal = sueldoSemanal; }
}