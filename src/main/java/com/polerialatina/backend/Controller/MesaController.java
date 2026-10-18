package com.polerialatina.backend.Controller;

import com.polerialatina.backend.Model.Mesa;
import com.polerialatina.backend.Repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    @Autowired
    private MesaRepository mesaRepository;

    // Listar estado de todas las mesas del salón
    @GetMapping
    public List<Mesa> listarMesas() {
        return mesaRepository.findAll();
    }

    // Cambiar estado de una mesa (Ej: de Libre a Ocupada, o liberarla con los "lentes")
    @PutMapping("/{id}/estado")
    public Mesa cambiarEstadoMesa(@PathVariable Long id, @RequestParam String nuevoEstado) {
        Mesa mesa = mesaRepository.findById(id).orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
        mesa.setEstado(nuevoEstado);
        return mesaRepository.save(mesa);
    }
}