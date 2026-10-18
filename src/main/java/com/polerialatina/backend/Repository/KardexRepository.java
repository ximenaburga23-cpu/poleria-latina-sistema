package com.polerialatina.backend.Repository;

import com.polerialatina.backend.Model.Kardex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KardexRepository extends JpaRepository<Kardex, Long> {
}