package com.polerialatina.backend.Controller;

import com.polerialatina.backend.Model.TransaccionCaja;
import com.polerialatina.backend.Repository.TransaccionCajaRepository;
import com.polerialatina.backend.Service.KardexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private KardexService kardexService;

    @Autowired
    private TransaccionCajaRepository cajaRepository;

    // Estructura que recibirá el pedido desde React
    public static class DetallePedido {
        public Long productoId;
        public int cantidad;
    }

    public static class PedidoRequest {
        public String tipoVenta; // 'mesa' o 'llevar'
        public String mesa;
        public String metodoPago; // 'EFECTIVO', 'YAPE', 'TARJETA'
        public BigDecimal total;
        public List<DetallePedido> items;
    }

    @PostMapping("/cobrar")
    public String procesarVenta(@RequestBody PedidoRequest pedido) {
        
        // 1. Descontar insumos del Kardex por cada plato vendido
        for (DetallePedido item : pedido.items) {
            kardexService.registrarSalidaPorVenta(item.productoId, item.cantidad);
        }

        // 2. Registrar el ingreso de dinero en la Caja
        TransaccionCaja transaccion = new TransaccionCaja();
        transaccion.setTipo("INGRESO");
        transaccion.setMetodoPago(pedido.metodoPago);
        transaccion.setMonto(pedido.total);
        transaccion.setConcepto("Venta (" + pedido.tipoVenta + ") - " + (pedido.mesa != null ? pedido.mesa : "Para Llevar"));
        
        cajaRepository.save(transaccion);

        return "¡Venta cobrada con éxito, inventario actualizado y dinero registrado en caja!";
    }
}