package com.polerialatina.backend.Repository;

import com.polerialatina.backend.Model.AdelantoPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdelantoPersonalRepository extends JpaRepository<AdelantoPersonal, Long> {
    List<AdelantoPersonal> findByTrabajadorIdAndEstado(Long trabajadorId, String estado);
}