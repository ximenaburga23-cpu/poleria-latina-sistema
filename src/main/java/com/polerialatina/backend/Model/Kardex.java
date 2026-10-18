package com.polerialatina.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kardex")
@Data
public class Kardex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "insumo_id")
    private Insumo insumo;

    @Column(name = "tipo_movimiento", length = 20)
    private String tipoMovimiento; // ENTRADA o SALIDA

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "stock_resultante", nullable = false, precision = 10, scale = 2)
    private BigDecimal stockResultante;

    @Column(length = 255)
    private String motivo;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora = LocalDateTime.now();
}