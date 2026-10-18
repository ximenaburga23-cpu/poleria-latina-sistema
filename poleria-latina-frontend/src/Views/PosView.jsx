import React, { useState, useEffect } from 'react';
import api from '../Services/api'; // Asegúrate de tener tu api.js en una carpeta Services

export default function PosView() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [tipoVenta, setTipoVenta] = useState('mesa'); // 'mesa' o 'llevar'
    const [mesaSeleccionada, setMesaSeleccionada] = useState('');
    const [metodoPago, setMetodoPago] = useState('EFECTIVO'); // Nuevo estado para el método de pago

    // Cargar productos desde Spring Boot y MySQL
    useEffect(() => {
        api.get('/productos')
            .then(res => setProductos(res.data))
            .catch(err => console.error("Error al cargar productos:", err));
    }, []);

    // Agregar producto al carrito
    const agregarAlCarrito = (prod) => {
        const existe = carrito.find(item => item.id === prod.id);
        if (existe) {
            setCarrito(carrito.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item));
        } else {
            setCarrito([...carrito, { ...prod, cantidad: 1 }]);
        }
    };

    // Calcular total
    const totalPagar = carrito.reduce((acc, item) => acc + (item.precioVenta * item.cantidad), 0);

    // Función de cobro conectada al backend de Spring Boot
    const handleCobrar = () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        if (tipoVenta === 'mesa' && !mesaSeleccionada) {
            alert("Por favor seleccione una mesa.");
            return;
        }

        const pedidoData = {
            tipoVenta: tipoVenta,
            mesa: mesaSeleccionada,
            metodoPago: metodoPago,
            total: totalPagar,
            items: carrito.map(item => ({
                productoId: item.id,
                cantidad: item.cantidad
            }))
        };

        api.post('/ventas/cobrar', pedidoData)
            .then(res => {
                alert(res.data); // Muestra el mensaje exitoso del backend
                setCarrito([]); // Limpia el carrito
                setMesaSeleccionada('');
            })
            .catch(err => {
                console.error("Error al cobrar:", err);
                alert("Hubo un error al procesar la venta con el servidor.");
            });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
            
            {/* IZQUIERDA: Catálogo de Platos */}
            <div style={{ flex: 2, padding: '20px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ color: '#b91c1c', margin: 0 }}>🍗 Pollería Latina</h1>
                    <span style={{ backgroundColor: '#15803d', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '14px' }}>Local Abierto</span>
                </header>

                <h3 style={{ color: '#374151' }}>¿Qué servimos hoy?</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {productos.map(prod => (
                        <div key={prod.id} onClick={() => agregarAlCarrito(prod)} style={{ background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #e5e7eb' }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{prod.nombre}</h4>
                            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 10px 0' }}>{prod.categoria}</p>
                            <span style={{ fontWeight: 'bold', color: '#b91c1c', fontSize: '16px' }}>S/ {prod.precioVenta}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* DERECHA: Carrito Lateral */}
            <div style={{ flex: 1, background: '#fff', borderLeft: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 10px rgba(0,0,0,0.02)' }}>
                <h2 style={{ color: '#1f2937', marginTop: 0 }}>Pedido Actual</h2>

                {/* Selector de En Mesa o Para Llevar */}
                <div style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '8px', marginBottom: '15px' }}>
                    <button 
                        onClick={() => setTipoVenta('mesa')} 
                        style={{ flex: 1, padding: '8px', border: 'none', background: tipoVenta === 'mesa' ? '#fff' : 'transparent', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', color: tipoVenta === 'mesa' ? '#b91c1c' : '#4b5563', boxShadow: tipoVenta === 'mesa' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                        En Mesa
                    </button>
                    <button 
                        onClick={() => setTipoVenta('llevar')} 
                        style={{ flex: 1, padding: '8px', border: 'none', background: tipoVenta === 'llevar' ? '#fff' : 'transparent', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', color: tipoVenta === 'llevar' ? '#b91c1c' : '#4b5563', boxShadow: tipoVenta === 'llevar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                        Para Llevar
                    </button>
                </div>

                {/* Si es en mesa, mostrar selector de mesas */}
                {tipoVenta === 'mesa' && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', display: 'block', marginBottom: '5px' }}>Mesa(s) Asignada(s):</label>
                        <select 
                            value={mesaSeleccionada} 
                            onChange={(e) => setMesaSeleccionada(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                            <option value="">Seleccione Mesa...</option>
                            <option value="Mesa 1">Mesa 1</option>
                            <option value="Mesa 2">Mesa 2</option>
                            <option value="Mesa 3">Mesa 3</option>
                            <option value="Mesa 4 + 5">Unir Mesas (4 + 5)</option>
                        </select>
                    </div>
                )}

                {/* Selector de Método de Pago */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', display: 'block', marginBottom: '5px' }}>Método de Pago:</label>
                    <select 
                        value={metodoPago} 
                        onChange={(e) => setMetodoPago(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="YAPE">Yape / Plin</option>
                        <option value="TARJETA">Tarjeta / POS</option>
                    </select>
                </div>

                {/* Lista de productos en el carrito */}
                <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '10px 0' }}>
                    {carrito.length === 0 ? (
                        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '40px' }}>El carrito está vacío</p>
                    ) : (
                        carrito.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '14px' }}>
                                <span>{item.nombre} (x{item.cantidad})</span>
                                <span style={{ fontWeight: 'bold' }}>S/ {(item.precioVenta * item.cantidad).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Total y Botón de Cobrar */}
                <div style={{ paddingTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                        <span>Total:</span>
                        <span style={{ color: '#b91c1c' }}>S/ {totalPagar.toFixed(2)}</span>
                    </div>
                    <button 
                        style={{ width: '100%', backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                        onClick={handleCobrar}>
                        Cobrar Pedido
                    </button>
                </div>
            </div>

        </div>
    );
}