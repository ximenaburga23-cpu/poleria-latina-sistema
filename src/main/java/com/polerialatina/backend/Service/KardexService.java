package com.polerialatina.backend.Service;

import com.polerialatina.backend.Model.Insumo;
import com.polerialatina.backend.Model.Kardex;
import com.polerialatina.backend.Model.Receta;
import com.polerialatina.backend.Repository.InsumoRepository;
import com.polerialatina.backend.Repository.KardexRepository;
import com.polerialatina.backend.Repository.RecetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class KardexService {

    @Autowired
    private RecetaRepository recetaRepository;

    @Autowired
    private InsumoRepository insumoRepository;

    @Autowired
    private KardexRepository kardexRepository;

    @Transactional
    public void registrarSalidaPorVenta(Long productoId, int cantidadVendida) {
        // 1. Buscamos qué ingredientes (receta/escandallo) componen este plato
        List<Receta> recetas = recetaRepository.findByProductoId(productoId);

        for (Receta receta : recetas) {
            Insumo insumo = receta.getInsumo();
            
            // Calculamos el consumo total (Ej: 0.25 kg x 2 platos vendidos = 0.50 kg)
            BigDecimal consumoTotal = receta.getCantidadConsumida().multiply(BigDecimal.valueOf(cantidadVendida));

            // Restamos al stock actual del almacén
            BigDecimal stockNuevo = insumo.getStockActual().subtract(consumoTotal);
            insumo.setStockActual(stockNuevo);
            insumoRepository.save(insumo);

            // Registramos el movimiento exacto en el Kardex
            Kardex movimiento = new Kardex();
            movimiento.setInsumo(insumo);
            movimiento.setTipoMovimiento("SALIDA");
            movimiento.setCantidad(consumoTotal);
            movimiento.setStockResultante(stockNuevo);
            movimiento.setMotivo("Venta POS - Plato ID: " + productoId);
            movimiento.setFechaHora(LocalDateTime.now());

            kardexRepository.save(movimiento);
        }
    }
}