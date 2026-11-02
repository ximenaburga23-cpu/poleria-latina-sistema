package com.polerialatina.backend.Controller;

import com.polerialatina.backend.Model.Producto;
import com.polerialatina.backend.Repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearProducto(@RequestBody Producto producto) {
        try {
            String nombreMayus = producto.getNombre().trim().toUpperCase();
            
            Optional<Producto> existente = productoRepository.findByNombre(nombreMayus);
            if (existente.isPresent()) {
                return ResponseEntity.badRequest().body("El plato o bebida ya existe en el sistema.");
            }

            producto.setNombre(nombreMayus);
            if (producto.getActivo() == null) {
                producto.setActivo(true);
            }
            
            Producto nuevo = productoRepository.save(producto);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            // Esto imprimirá el error real de SQL en la alerta de la pantalla
            return ResponseEntity.status(500).body("Error de BD: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable Long id, @RequestBody Producto detalles) {
        Optional<Producto> productoOpt = productoRepository.findById(id);
        if (!productoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Producto producto = productoOpt.get();
        String nuevoNombre = detalles.getNombre().trim().toUpperCase();

        Optional<Producto> existente = productoRepository.findByNombre(nuevoNombre);
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("Ya existe otro plato con ese nombre.");
        }

        producto.setNombre(nuevoNombre);
        // CORREGIDO: Usar precioVenta en lugar de precio
        producto.setPrecioVenta(detalles.getPrecioVenta());
        producto.setCategoria(detalles.getCategoria().toUpperCase());
        if (detalles.getActivo() != null) {
            producto.setActivo(detalles.getActivo());
        }

        Producto actualizado = productoRepository.save(producto);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id) {
        Optional<Producto> productoOpt = productoRepository.findById(id);
        if (!productoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Producto producto = productoOpt.get();
        producto.setActivo(!producto.getActivo());
        productoRepository.save(producto);
        return ResponseEntity.ok(producto);
    }
}