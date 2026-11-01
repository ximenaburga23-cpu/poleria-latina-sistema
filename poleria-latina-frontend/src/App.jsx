import React, { useState } from 'react';
import PosView from './Views/PosView';
import SalonView from './Views/SalonView';
import CajaView from './Views/CajaView';
import KardexView from './Views/KardexView';
import ProveedoresView from './Views/ProveedoresView';
import PersonalView from './Views/PersonalView';
import ReportesView from './Views/ReportesView';
import ProductosView from './Views/ProductosView';

export default function App() {
  const [vistaActual, setVistaActual] = useState('pos');

  const [productos, setProductos] = useState([
    { id: 1, nombre: '1 Pollo Entero', precio: 84.00, categoria: 'Pollos' },
    { id: 2, nombre: '1/2 Pollo a la Brasa', precio: 44.00, categoria: 'Pollos' },
    { id: 3, nombre: '1/4 Pollo a la Brasa', precio: 22.00, categoria: 'Pollos' },
    { id: 4, nombre: '1/8 Pollo a la Brasa', precio: 12.00, categoria: 'Pollos' },
    { id: 5, nombre: 'Aguadito de Pollo', precio: 10.00, categoria: 'Entradas' },
    { id: 6, nombre: 'Porción de Mollejas', precio: 15.00, categoria: 'Entradas' },
    { id: 7, nombre: 'Inka Kola 1 Litro', precio: 8.00, categoria: 'Bebidas' },
    { id: 8, nombre: 'Chicha Morada 1L', precio: 7.00, categoria: 'Bebidas' },
    { id: 9, nombre: 'Monstruito', precio: 20.00, categoria: 'Pollos' }
  ]);

  const [mesas, setMesas] = useState([
    { id: 'Mesa 1', estado: 'Libre', items: [], total: 0 },
    { id: 'Mesa 2', estado: 'Libre', items: [], total: 0 },
    { id: 'Mesa 3', estado: 'Libre', items: [], total: 0 },
    { id: 'Mesa 4', estado: 'Libre', items: [], total: 0 }
  ]);

  return (
    // Contenedor principal que llena el 100% real de la pantalla sin desbordarse
    <div style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', boxSizing: 'border-box' }}>
      
      {/* MENÚ LATERAL IZQUIERDO (Ancho fijo que nunca cambia) */}
      <div style={{ width: '260px', minWidth: '260px', backgroundColor: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box', height: '100vh', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <span style={{ fontSize: '24px' }}>🍗</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#f87171' }}>Pollería Latina</h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Sistema de Gestión</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => setVistaActual('pos')} style={btnStyle(vistaActual === 'pos')}>🛒 Punto de Venta (POS)</button>
            <button onClick={() => setVistaActual('productos')} style={btnStyle(vistaActual === 'productos')}>🍽️ Gestionar Menú / Platos</button>
            <button onClick={() => setVistaActual('salon')} style={btnStyle(vistaActual === 'salon')}>🪑 Control de Mesas</button>
            <button onClick={() => setVistaActual('caja')} style={btnStyle(vistaActual === 'caja')}>💰 Cuadre de Caja</button>
            <button onClick={() => setVistaActual('kardex')} style={btnStyle(vistaActual === 'kardex')}>📦 Inventario y Kardex</button>
            <button onClick={() => setVistaActual('proveedores')} style={btnStyle(vistaActual === 'proveedores')}>🤝 Proveedores y Compras</button>
            <button onClick={() => setVistaActual('personal')} style={btnStyle(vistaActual === 'personal')}>👥 Control de Personal</button>
            <button onClick={() => setVistaActual('reportes')} style={btnStyle(vistaActual === 'reportes')}>📈 Reportes y Auditoría</button>
          </nav>
        </div>

        <div style={{ fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #334155', paddingTop: '15px' }}>
          Estado: <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Conectado</span>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DERECHO (Ocupa de forma flexible todo el espacio restante sin barras) */}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', overflowX: 'hidden', padding: '30px', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          {vistaActual === 'pos' && <PosView productos={productos} mesas={mesas} setMesas={setMesas} />}
          {vistaActual === 'productos' && <ProductosView productos={productos} setProductos={setProductos} />}
          {vistaActual === 'salon' && <SalonView mesas={mesas} setMesas={setMesas} productos={productos} />}
          {vistaActual === 'caja' && <CajaView />}
          {vistaActual === 'kardex' && <KardexView />}
          {vistaActual === 'proveedores' && <ProveedoresView />}
          {vistaActual === 'personal' && <PersonalView />}
          {vistaActual === 'reportes' && <ReportesView />}
        </div>
      </div>

    </div>
  );
}

const btnStyle = (activo) => ({
  width: '100%',
  padding: '10px 14px',
  backgroundColor: activo ? '#b91c1c' : 'transparent',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
});