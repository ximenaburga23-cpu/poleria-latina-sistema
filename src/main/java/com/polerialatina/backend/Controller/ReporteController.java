package com.polerialatina.backend.Controller;

import com.polerialatina.backend.Model.CompraProveedor;
import com.polerialatina.backend.Model.Kardex;
import com.polerialatina.backend.Repository.CompraProveedorRepository;
import com.polerialatina.backend.Repository.KardexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private CompraProveedorRepository compraRepo;

    @Autowired
    private KardexRepository kardexRepo;

    // Endpoint para exportar el Kardex a formato CSV (Excel)
    @GetMapping("/exportar/kardex")
    public ResponseEntity<String> exportarKardexCSV() {
        List<Kardex> movimientos = kardexRepo.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Insumo,Tipo Movimiento,Cantidad,Stock Resultante,Fecha y Hora\n");

        for (Kardex m : movimientos) {
            csv.append(m.getId()).append(",")
               .append(m.getInsumo().getNombre()).append(",")
               .append(m.getTipoMovimiento()).append(",")
               .append(m.getCantidad()).append(",")
               .append(m.getStockResultante()).append(",")
               .append(m.getFechaHora()).append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=kardex_poleria.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }

    // Endpoint para exportar el reporte de Proveedores a CSV (Excel)
    @GetMapping("/exportar/proveedores")
    public ResponseEntity<String> exportarProveedoresCSV() {
        List<CompraProveedor> compras = compraRepo.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Proveedor,Boleta,Insumo,Cantidad,Precio Unitario,Total,Estado de Pago,Fecha\n");

        for (CompraProveedor c : compras) {
            csv.append(c.getId()).append(",")
               .append(c.getNombreProveedor()).append(",")
               .append(c.getNumeroBoleta()).append(",")
               .append(c.getInsumoComprado()).append(",")
               .append(c.getCantidad()).append(",")
               .append(c.getPrecioUnitario()).append(",")
               .append(c.getMontoTotal()).append(",")
               .append(c.getEstadoPago()).append(",")
               .append(c.getFechaHora()).append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=compras_proveedores.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
}