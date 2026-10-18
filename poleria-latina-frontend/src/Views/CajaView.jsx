import React, { useState, useEffect } from 'react';
import api from '../Services/api';

export default function CajaView() {
    const [transacciones, setTransacciones] = useState([]);
    const [montoApertura, setMontoApertura] = useState(100); // Caja chica inicial por defecto

    // Cargar transacciones del día
    useEffect(() => {
        // Aquí puedes conectar el endpoint de transacciones de caja de tu backend
        // api.get('/transacciones-caja').then(res => setTransacciones(res.data));
        
        // Datos de ejemplo para visualizar mientras tanto:
        setTransacciones([
            { id: 1, tipo: 'INGRESO', metodoPago: 'EFECTIVO', monto: 120.00, concepto: 'Venta Mesa 2' },
            { id: 2, tipo: 'INGRESO', metodoPago: 'YAPE', monto: 85.50, concepto: 'Venta Mesa 4 + 5' },
            { id: 3, tipo: 'EGRESO', metodoPago: 'EFECTIVO', monto: 20.00, concepto: 'Adelanto mozo' }
        ]);
    }, []);

    // Totales separados por método de pago (Bolsillos independientes)
    const totalEfectivo = transacciones
        .filter(t => t.metodoPago === 'EFECTIVO')
        .reduce((acc, t) => t.tipo === 'INGRESO' ? acc + t.monto : acc - t.monto, montoApertura);

    const totalYape = transacciones
        .filter(t => t.metodoPago === 'YAPE')
        .reduce((acc, t) => t.tipo === 'INGRESO' ? acc + t.monto : acc, 0);

    const totalTarjeta = transacciones
        .filter(t => t.metodoPago === 'TARJETA')
        .reduce((acc, t) => t.tipo === 'INGRESO' ? acc + t.monto : acc, 0);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '20px' }}>
                <h1 style={{ color: '#b91c1c', margin: 0 }}>💰 Control de Caja y Bolsillos</h1>
                <p style={{ color: '#4b5563', margin: '5px 0 0 0' }}>Cuadre diario de ingresos y egresos separado por método de pago.</p>
            </header>

            {/* Tarjetas de Resumen (Bolsillos de Dinero) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', borderLeft: '6px solid #15803d', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Bolsillo Efectivo</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d', margin: 0 }}>S/ {totalEfectivo.toFixed(2)}</p>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>(Incluye caja chica inicial: S/ {montoApertura.toFixed(2)})</span>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', borderLeft: '6px solid #2563eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Bolsillo Yape / Digital</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>S/ {totalYape.toFixed(2)}</p>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Verificar app móvil al cierre</span>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', borderLeft: '6px solid #d97706', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Tarjetas / POS</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>S/ {totalTarjeta.toFixed(2)}</p>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Voucher físico</span>
                </div>
            </div>

            {/* Historial de Movimientos del Día */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#1f2937', marginTop: 0 }}>Movimientos Registrados Hoy</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                            <th style={{ padding: '10px' }}>Tipo</th>
                            <th style={{ padding: '10px' }}>Concepto</th>
                            <th style={{ padding: '10px' }}>Método</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '10px', fontWeight: 'bold', color: t.tipo === 'INGRESO' ? '#15803d' : '#b91c1c' }}>
                                    {t.tipo}
                                </td>
                                <td style={{ padding: '10px', color: '#374151' }}>{t.concepto}</td>
                                <td style={{ padding: '10px', color: '#6b7280' }}>{t.metodoPago}</td>
                                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                                    {t.tipo === 'INGRESO' ? '+' : '-'} S/ {t.monto.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}