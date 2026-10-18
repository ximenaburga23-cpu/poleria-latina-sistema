package com.polerialatina.backend.Repository;

import com.polerialatina.backend.Model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Aquí Spring Boot hace la magia y ya sabe hacer consultas a la tabla productos
}