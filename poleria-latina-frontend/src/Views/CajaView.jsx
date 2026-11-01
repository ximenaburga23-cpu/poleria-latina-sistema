import React, { useState, useEffect } from 'react';
import api from '../Services/api';

export default function CajaView() {
    const [transacciones, setTransacciones] = useState([]);
    const [montoApertura, setMontoApertura] = useState(100); // Caja chica inicial por defecto

    useEffect(() => {
        // Datos de ejemplo para visualizar mientras tanto
        setTransacciones([
            { id: 1, tipo: 'INGRESO', metodoPago: 'EFECTIVO', monto: 120.00, concepto: 'Venta Mesa 2' },
            { id: 2, tipo: 'INGRESO', metodoPago: 'YAPE', monto: 85.50, concepto: 'Venta Mesa 4 + 5' },
            { id: 3, tipo: 'EGRESO', metodoPago: 'EFECTIVO', monto: 20.00, concepto: 'Adelanto mozo' }
        ]);
    }, []);

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
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px' }}>
            
            {/* ENCABEZADO AMPLIO Y CENTRADO (Estilo Control de Mesas) */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '40px', marginBottom: '5px' }}>💰</div>
                <h1 style={{ color: '#b91c1c', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Control de Caja y Bolsillos</h1>
                <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '15px' }}>Cuadre diario de ingresos y egresos separados por método de pago.</p>
            </div>

            {/* Tarjetas de Resumen (Bolsillos de Dinero más grandes y espaciosos) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', borderTop: '6px solid #15803d', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#374151', fontSize: '18px' }}>Bolsillo Efectivo</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#15803d', margin: 0 }}>S/ {totalEfectivo.toFixed(2)}</p>
                    </div>
                    <span style={{ fontSize: '13px', color: '#6b7280', marginTop: '15px', display: 'block' }}>(Incluye caja chica inicial: S/ {montoApertura.toFixed(2)})</span>
                </div>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', borderTop: '6px solid #2563eb', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#374151', fontSize: '18px' }}>Bolsillo Yape / Digital</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>S/ {totalYape.toFixed(2)}</p>
                    </div>
                    <span style={{ fontSize: '13px', color: '#6b7280', marginTop: '15px', display: 'block' }}>Verificar app móvil al cierre</span>
                </div>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', borderTop: '6px solid #d97706', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#374151', fontSize: '18px' }}>Tarjetas / POS</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>S/ {totalTarjeta.toFixed(2)}</p>
                    </div>
                    <span style={{ fontSize: '13px', color: '#6b7280', marginTop: '15px', display: 'block' }}>Voucher físico</span>
                </div>

            </div>

            {/* Historial de Movimientos del Día (Más amplio) */}
            <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#1f2937', marginTop: 0, fontSize: '18px', marginBottom: '20px' }}>Movimientos Registrados Hoy</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                            <th style={{ padding: '12px' }}>Tipo</th>
                            <th style={{ padding: '12px' }}>Concepto</th>
                            <th style={{ padding: '12px' }}>Método</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: t.tipo === 'INGRESO' ? '#15803d' : '#b91c1c' }}>
                                    {t.tipo}
                                </td>
                                <td style={{ padding: '14px 12px', color: '#374151' }}>{t.concepto}</td>
                                <td style={{ padding: '14px 12px', color: '#6b7280' }}>{t.metodoPago}</td>
                                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>
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