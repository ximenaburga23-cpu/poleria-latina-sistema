package com.polerialatina.backend.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "mesas")
@Data
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer numero;

    @Column(length = 20)
    private String estado = "LIBRE"; // LIBRE, OCUPADA, POR_COBRAR

    @Column(name = "es_unida")
    private Boolean esUnida = false;
}