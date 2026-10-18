package com.polerialatina.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones_caja")
@Data
public class TransaccionCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String tipo; // INGRESO (Venta) o EGRESO (Pago a proveedor / Adelanto)

    @Column(name = "metodo_pago", length = 20)
    private String metodoPago; // EFECTIVO, YAPE, TARJETA

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(length = 255)
    private String concepto; // Ej: "Venta Mesa 3", "Adelanto mozo Juan", "Compra Papa Sosa"

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora = LocalDateTime.now();
}