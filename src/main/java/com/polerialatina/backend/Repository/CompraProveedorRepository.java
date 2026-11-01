package com.polerialatina.backend.Repository;

import com.polerialatina.backend.Model.CompraProveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompraProveedorRepository extends JpaRepository<CompraProveedor, Long> {
    List<CompraProveedor> findByNombreProveedor(String nombreProveedor);
}