package com.polerialatina.backend.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "adelantos_personal")
public class AdelantoPersonal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trabajador_id")
    private Trabajador trabajador;

    private BigDecimal montoAdelanto; // Ej: 20.00
    private String autorizadoPor;     // Ej: Mamá
    private LocalDateTime fechaHora;
    private String estado;            // 'PENDIENTE_DE_DESCUENTO' o 'PAGADO_SEMANA'

    // Constructores, Getters y Setters
    public AdelantoPersonal() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trabajador getTrabajador() { return trabajador; }
    public void setTrabajador(Trabajador trabajador) { this.trabajador = trabajador; }

    public BigDecimal getMontoAdelanto() { return montoAdelanto; }
    public void setMontoAdelanto(BigDecimal montoAdelanto) { this.montoAdelanto = montoAdelanto; }

    public String getAutorizadoPor() { return autorizadoPor; }
    public void setAutorizadoPor(String autorizadoPor) { this.autorizadoPor = autorizadoPor; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}