import React, { useState } from 'react';
import PosView from './PosView';
import SalonView from './SalonView';
import CajaView from './CajaView';

export default function DashboardLayout() {
    const [vistaActual, setVistaActual] = useState('pos'); // 'pos', 'salon', 'caja'

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6' }}>
            
            {/* MENÚ LATERAL DE NAVEGACIÓN */}
            <div style={{ width: '250px', backgroundColor: '#1f2937', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
                    <h2 style={{ color: '#f87171', margin: 0, fontSize: '20px' }}>🍗 Pollería Latina</h2>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '5px 0 0 0' }}>Sistema de Gestión</p>
                </div>

                <nav style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <button 
                        onClick={() => setVistaActual('pos')}
                        style={{ textAlign: 'left', padding: '12px 15px', background: vistaActual === 'pos' ? '#b91c1c' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                        🛒 Punto de Venta (POS)
                    </button>
                    <button 
                        onClick={() => setVistaActual('salon')}
                        style={{ textAlign: 'left', padding: '12px 15px', background: vistaActual === 'salon' ? '#b91c1c' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                        🍽️ Control de Mesas
                    </button>
                    <button 
                        onClick={() => setVistaActual('caja')}
                        style={{ textAlign: 'left', padding: '12px 15px', background: vistaActual === 'caja' ? '#b91c1c' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                        💰 Cuadre de Caja
                    </button>
                </nav>

                <div style={{ padding: '15px 20px', borderTop: '1px solid #374151', fontSize: '12px', color: '#9ca3af' }}>
                    Estado: <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Conectado</span>
                </div>
            </div>

            {/* CONTENEDOR DE LA PANTALLA ACTIVA */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {vistaActual === 'pos' && <PosView />}
                {vistaActual === 'salon' && <SalonView />}
                {vistaActual === 'caja' && <CajaView />}
            </div>

        </div>
    );
}