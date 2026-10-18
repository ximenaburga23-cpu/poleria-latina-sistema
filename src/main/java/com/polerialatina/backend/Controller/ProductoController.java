package com.polerialatina.backend.Controller;

import com.polerialatina.backend.Model.Producto;
import com.polerialatina.backend.Repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Permite que Vue.js se conecte sin problemas de seguridad
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // 1. Endpoint para listar todos los platos y bebidas
    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // 2. Endpoint para crear un nuevo producto (ej. un nuevo plato o gaseosa)
    @PostMapping
    public Producto guardarProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }
}