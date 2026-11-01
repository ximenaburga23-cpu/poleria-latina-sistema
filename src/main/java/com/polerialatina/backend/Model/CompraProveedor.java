package com.polerialatina.backend.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "compras_proveedores")
public class CompraProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreProveedor; // Ej: Sosa, Carlos, Inka Kola
    private String numeroBoleta;    // Ej: B001-9824
    private String insumoComprado;  // Ej: Papa amarilla, Gaseosa 1L
    private double cantidad;        // Ej: 30.0 (kg o unidades)
    private BigDecimal precioUnitario; // Ej: 2.40
    private BigDecimal montoTotal;     // Cantidad * Precio Unitario
    private String estadoPago;      // 'PAGADO' o 'POR_PAGAR'
    private LocalDateTime fechaHora;

    // Constructores, Getters y Setters
    public CompraProveedor() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreProveedor() { return nombreProveedor; }
    public void setNombreProveedor(String nombreProveedor) { this.nombreProveedor = nombreProveedor; }

    public String getNumeroBoleta() { return numeroBoleta; }
    public void setNumeroBoleta(String numeroBoleta) { this.numeroBoleta = numeroBoleta; }

    public String getInsumoComprado() { return insumoComprado; }
    public void setInsumoComprado(String insumoComprado) { this.insumoComprado = insumoComprado; }

    public double getCantidad() { return cantidad; }
    public void setCantidad(double cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public BigDecimal getMontoTotal() { return montoTotal; }
    public void setMontoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; }

    public String getEstadoPago() { return estadoPago; }
    public void setEstadoPago(String estadoPago) { this.estadoPago = estadoPago; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
}