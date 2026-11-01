import React, { useState, useEffect } from 'react';
import api from '../Services/api';

export default function ProveedoresView() {
    const [compras, setCompras] = useState([]);
    const [proveedor, setProveedor] = useState('');
    const [boleta, setBoleta] = useState('');
    const [insumo, setInsumo] = useState('Papa amarilla');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
    const [estadoPago, setEstadoPago] = useState('PAGADO');

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = () => {
        api.get('/proveedores')
            .then(res => setCompras(res.data))
            .catch(err => console.error("Error al cargar compras:", err));
    };

    const handleRegistrarCompra = (e) => {
        e.preventDefault();
        if (!proveedor || !cantidad || !precio) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        const nuevaCompra = {
            nombreProveedor: proveedor,
            numeroBoleta: boleta,
            insumoComprado: insumo,
            cantidad: parseFloat(cantidad),
            precioUnitario: parseFloat(precio),
            estadoPago: estadoPago
        };

        api.post('/proveedores/registrar', nuevaCompra)
            .then(res => {
                alert(res.data);
                setProveedor('');
                setBoleta('');
                setCantidad('');
                setPrecio('');
                cargarCompras();
            })
            .catch(err => {
                console.error("Error al registrar compra:", err);
                alert("Hubo un error al guardar la compra.");
            });
    };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px' }}>
            
            {/* ENCABEZADO AMPLIO Y CENTRADO */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '40px', marginBottom: '5px' }}>🤝</div>
                <h1 style={{ color: '#b91c1c', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Gestión de Proveedores y Compras</h1>
                <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '15px' }}>Registro de boletas, control de deudas y suma automática al almacén</p>
            </div>

            {/* Formulario de Registro Espacioso */}
            <form onSubmit={handleRegistrarCompra} style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#374151' }}>Nombre / Apodo del Proveedor:</label>
                    <input type="text" placeholder="Ej: Sosa, Carlos, Inka Kola" value={proveedor} onChange={e => setProveedor(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#374151' }}>Nro. de Boleta:</label>
                    <input type="text" placeholder="Ej: B001-9824" value={boleta} onChange={e => setBoleta(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#374151' }}>Insumo Comprado:</label>
                    <select value={insumo} onChange={e => setInsumo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }}>
                        <option value="Papa amarilla">Papa amarilla (kg)</option>
                        <option value="Pollo entero">Pollo entero (kg)</option>
                        <option value="Inka Kola 1L">Inka Kola 1L (Botellas)</option>
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#374151' }}>Cantidad:</label>
                    <input type="number" placeholder="Ej: 30" value={cantidad} onChange={e => setCantidad(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#374151' }}>Precio por Unidad (S/):</label>
                    <input type="number" step="0.01" placeholder="Ej: 2.40" value={precio} onChange={e => setPrecio(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#374151' }}>Estado de Pago:</label>
                    <select value={estadoPago} onChange={e => setEstadoPago(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }}>
                        <option value="PAGADO">Pagado (Al contado)</option>
                        <option value="POR_PAGAR">Por Pagar (Fiado)</option>
                    </select>
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                    <button type="submit" style={{ width: '100%', backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                        Registrar Compra y Actualizar Almacén
                    </button>
                </div>
            </form>

            {/* Historial de Compras Amplio */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, color: '#1f2937', fontSize: '18px', marginBottom: '20px' }}>Historial de Boletas y Compras</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                            <th style={{ padding: '12px' }}>Proveedor</th>
                            <th style={{ padding: '12px' }}>Boleta</th>
                            <th style={{ padding: '12px' }}>Insumo</th>
                            <th style={{ padding: '12px' }}>Cantidad</th>
                            <th style={{ padding: '12px' }}>Total (S/)</th>
                            <th style={{ padding: '12px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '35px', color: '#9ca3af', fontSize: '15px' }}>No hay compras registradas.</td>
                            </tr>
                        ) : (
                            compras.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#1f2937' }}>{c.nombreProveedor}</td>
                                    <td style={{ padding: '14px 12px', color: '#4b5563' }}>{c.numeroBoleta || 'S/N'}</td>
                                    <td style={{ padding: '14px 12px', color: '#4b5563' }}>{c.insumoComprado}</td>
                                    <td style={{ padding: '14px 12px', color: '#4b5563' }}>{c.cantidad}</td>
                                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#b91c1c', fontSize: '16px' }}>S/ {c.montoTotal}</td>
                                    <td style={{ padding: '14px 12px' }}>
                                        {c.estadoPago === 'PAGADO' ? (
                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Pagado</span>
                                        ) : (
                                            <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Por Pagar</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}