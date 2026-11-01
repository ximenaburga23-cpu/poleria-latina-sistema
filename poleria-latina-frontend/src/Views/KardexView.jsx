import React, { useState, useEffect } from 'react';
import api from '../Services/api';

export default function KardexView() {
    const [insumos, setInsumos] = useState([]);

    useEffect(() => {
        api.get('/insumos')
            .then(res => setInsumos(res.data))
            .catch(err => console.error("Error al cargar inventario:", err));
    }, []);

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px' }}>
            
            {/* ENCABEZADO AMPLIO Y CENTRADO */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '40px', marginBottom: '5px' }}>📦</div>
                <h1 style={{ color: '#b91c1c', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Control de Inventario y Kardex</h1>
                <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '15px' }}>Monitoreo en tiempo real del almacén (Papas, Pollos, Insumos)</p>
            </div>

            {/* TABLA DE INVENTARIO AMPLIA Y MODERNA */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, color: '#1f2937', fontSize: '18px', marginBottom: '20px' }}>Stock Actual en Almacén</h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                            <th style={{ padding: '12px' }}>Insumo / Ingrediente</th>
                            <th style={{ padding: '12px' }}>Stock Real</th>
                            <th style={{ padding: '12px' }}>Unidad de Medida</th>
                            <th style={{ padding: '12px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insumos.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '35px', color: '#9ca3af', fontSize: '15px' }}>
                                    No hay insumos registrados o cargando datos...
                                </td>
                            </tr>
                        ) : (
                            insumos.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#1f2937' }}>{item.nombre}</td>
                                    <td style={{ padding: '14px 12px', fontWeight: 'bold' }}>{item.stockActual}</td>
                                    <td style={{ padding: '14px 12px', color: '#6b7280' }}>{item.unidadMedida}</td>
                                    <td style={{ padding: '14px 12px' }}>
                                        {item.stockActual <= 5 ? (
                                            <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                                                ⚠️ Stock Bajo
                                            </span>
                                        ) : (
                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                                                ✔️ Normal
                                            </span>
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