package com.polerialatina.backend.Controller;

import com.polerialatina.backend.Model.AdelantoPersonal;
import com.polerialatina.backend.Model.Trabajador;
import com.polerialatina.backend.Repository.AdelantoPersonalRepository;
import com.polerialatina.backend.Repository.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "*")
public class PersonalController {

    @Autowired
    private TrabajadorRepository trabajadorRepo;

    @Autowired
    private AdelantoPersonalRepository adelantoRepo;

    @GetMapping("/trabajadores")
    public List<Trabajador> listarTrabajadores() {
        return trabajadorRepo.findAll();
    }

    @PostMapping("/trabajadores/crear")
    public Trabajador crearTrabajador(@RequestBody Trabajador trabajador) {
        return trabajadorRepo.save(trabajador);
    }

    @PostMapping("/adelantos/registrar")
    public String registrarAdelanto(@RequestBody AdelantoPersonal adelanto) {
        adelanto.setFechaHora(LocalDateTime.now());
        adelanto.setEstado("PENDIENTE_DE_DESCUENTO");
        adelantoRepo.save(adelanto);
        return "¡Adelanto registrado correctamente!";
    }

    // Endpoint clave para calcular cuánto se le debe pagar exactamente al trabajador en la semana
    @GetMapping("/resumen-pago/{trabajadorId}")
    public Map<String, Object> calcularPagoSemanal(@PathVariable Long trabajadorId) {
        Trabajador trabajador = trabajadorRepo.findById(trabajadorId).orElseThrow();
        List<AdelantoPersonal> adelantos = adelantoRepo.findByTrabajadorIdAndEstado(trabajadorId, "PENDIENTE_DE_DESCUENTO");

        BigDecimal totalAdelantos = adelantos.stream()
                .map(AdelantoPersonal::getMontoAdelanto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldoNeto = trabajador.getSueldoSemanal().subtract(totalAdelantos);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("trabajador", trabajador.getNombre());
        respuesta.put("sueldoSemanal", trabajador.getSueldoSemanal());
        respuesta.put("totalAdelantos", totalAdelantos);
        respuesta.put("saldoNetoAPagar", saldoNeto);
        respuesta.put("adelantosDetalle", adelantos);

        return respuesta;
    }
}