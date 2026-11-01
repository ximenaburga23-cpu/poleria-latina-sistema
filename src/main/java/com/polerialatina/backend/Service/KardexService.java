package com.polerialatina.backend.Service;

import com.polerialatina.backend.Model.Kardex;
import com.polerialatina.backend.Model.Insumo;
import com.polerialatina.backend.Model.Receta;
import com.polerialatina.backend.Repository.KardexRepository;
import com.polerialatina.backend.Repository.InsumoRepository;
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
        List<Receta> recetas = recetaRepository.findByProductoId(productoId);

        for (Receta receta : recetas) {
            Insumo insumo = receta.getInsumo();
            
            // Calculamos el total a descontar en BigDecimal
            BigDecimal totalDescuento = BigDecimal.valueOf(receta.getCantidadNecesaria())
                    .multiply(BigDecimal.valueOf(cantidadVendida));

            BigDecimal stockActual = insumo.getStockActual();
            BigDecimal nuevoStock = stockActual.subtract(totalDescuento);
            
            // Evitamos stock negativo (si es menor a 0, se queda en 0)
            if (nuevoStock.compareTo(BigDecimal.ZERO) < 0) {
                nuevoStock = BigDecimal.ZERO;
            }

            insumo.setStockActual(nuevoStock);
            insumoRepository.save(insumo);

            Kardex movimiento = new Kardex();
            movimiento.setInsumo(insumo);
            movimiento.setTipoMovimiento("SALIDA_VENTA");
            movimiento.setCantidad(totalDescuento);
            movimiento.setStockResultante(insumo.getStockActual());
            movimiento.setFechaHora(LocalDateTime.now());
            kardexRepository.save(movimiento);
        }
    }
}