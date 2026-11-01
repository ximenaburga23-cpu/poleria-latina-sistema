package com.polerialatina.backend.Controller;

import com.polerialatina.backend.Model.CompraProveedor;
import com.polerialatina.backend.Model.Insumo;
import com.polerialatina.backend.Repository.CompraProveedorRepository;
import com.polerialatina.backend.Repository.InsumoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {

    @Autowired
    private CompraProveedorRepository compraRepo;

    @Autowired
    private InsumoRepository insumoRepo;

    @GetMapping
    public List<CompraProveedor> listarCompras() {
        return compraRepo.findAll();
    }

    @PostMapping("/registrar")
    public String registrarCompra(@RequestBody CompraProveedor compra) {
        // 1. Calcular el monto total (Cantidad x Precio Unitario)
        BigDecimal cantidadBD = BigDecimal.valueOf(compra.getCantidad());
        BigDecimal total = compra.getPrecioUnitario().multiply(cantidadBD);
        compra.setMontoTotal(total);
        compra.setFechaHora(LocalDateTime.now());

        // 2. Guardar la compra
        compraRepo.save(compra);

        // 3. Sumar automáticamente al inventario buscando por nombre (si tu repositorio usa otro método, cámbialo aquí)
        // Nota: Si usas findByNombre, asegúrate de tenerlo en InsumoRepository.
        Optional<Insumo> insumoOpt = insumoRepo.findAll().stream()
                .filter(i -> i.getNombre().equalsIgnoreCase(compra.getInsumoComprado()))
                .findFirst();

        if (insumoOpt.isPresent()) {
            Insumo insumo = insumoOpt.get();
            BigDecimal stockActual = insumo.getStockActual(); // Ya es BigDecimal
            insumo.setStockActual(stockActual.add(cantidadBD));
            insumoRepo.save(insumo);
        }

        return "¡Compra registrada con éxito y stock actualizado en el almacén!";
    }
}