package com.polerialatina.backend.Repository;

import com.polerialatina.backend.Model.TransaccionCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransaccionCajaRepository extends JpaRepository<TransaccionCaja, Long> {
}