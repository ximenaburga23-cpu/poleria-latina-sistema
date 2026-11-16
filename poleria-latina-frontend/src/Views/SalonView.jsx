import React, { useState } from 'react';
import '../Styles/SalonView.css';

export default function SalonView({ mesas = [], setMesas, productos = [] }) {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(mesas[0] || null);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [mostrarModalNuevaMesa, setMostrarModalNuevaMesa] = useState(false);
  const [nombreNuevaMesa, setNombreNuevaMesa] = useState('');

  // Estados para modal de cobro / finalizar orden
  const [modalCobroAbierto, setModalCobroAbierto] = useState(false);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoPaga, setMontoPaga] = useState('');

  // Filtrar mesas según pestañas superiores
  const mesasFiltradas = mesas.filter(m => {
    if (filtroEstado === 'TODAS') return true;
    if (filtroEstado === 'LIBRE') return m.estado === 'Libre';
    if (filtroEstado === 'OCUPADA') return m.estado === 'Ocupada';
    if (filtroEstado === 'POR_COBRAR') return m.estado === 'Por cobrar';
    return true;
  });

  const totalMesas = mesas.length;
  const libresCount = mesas.filter(m => m.estado === 'Libre').length;
  const ocupadasCount = mesas.filter(m => m.estado === 'Ocupada').length;
  const porCobrarCount = mesas.filter(m => m.estado === 'Por cobrar').length;

  const handleCrearMesa = (e) => {
    e.preventDefault();
    if (!nombreNuevaMesa.trim()) return;
    const nueva = {
      id: nombreNuevaMesa.trim(),
      estado: 'Libre',
      personas: 4,
      tiempo: '0 min en mesa',
      moza: 'Lucía P.',
      orden: '#0' + Math.floor(1000 + Math.random() * 9000),
      items: [],
      subtotal: 0,
      igv: 0,
      total: 0
    };
    setMesas([...mesas, nueva]);
    setNombreNuevaMesa('');
    setMostrarModalNuevaMesa(false);
  };

  const agregarProductoAMesa = (prod) => {
    if (!mesaSeleccionada) return;
    const precio = parseFloat(prod.precioVenta ?? prod.precio ?? 0);

    const actualizadas = mesas.map(m => {
      if (m.id === mesaSeleccionada.id) {
        let items = [...(m.items || [])];
        const index = items.findIndex(i => i.nombre === prod.nombre);
        if (index !== -1) {
          items[index].cantidad += 1;
        } else {
          items.push({ nombre: prod.nombre, precio, cantidad: 1, detalle: 'Papas + ensalada' });
        }
        const subtotal = items.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        return { ...m, estado: 'Ocupada', items, subtotal, igv, total };
      }
      return m;
    });

    setMesas(actualizadas);
    const seleccionActualizada = actualizadas.find(m => m.id === mesaSeleccionada.id);
    setMesaSeleccionada(seleccionActualizada);
  };

  const cambiarCantidadItem = (index, delta) => {
    if (!mesaSeleccionada) return;

    const actualizadas = mesas.map(m => {
      if (m.id === mesaSeleccionada.id) {
        let items = [...m.items];
        items[index].cantidad += delta;
        if (items[index].cantidad <= 0) {
          items.splice(index, 1);
        }
        const subtotal = items.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        const estado = items.length === 0 ? 'Libre' : 'Ocupada';
        return { ...m, estado, items, subtotal, igv, total };
      }
      return m;
    });

    setMesas(actualizadas);
    const seleccionActualizada = actualizadas.find(m => m.id === mesaSeleccionada.id);
    setMesaSeleccionada(seleccionActualizada);
  };

  const cobrarMesa = () => {
    if (!mesaSeleccionada) return;
    const mesaId = mesaSeleccionada.id;

    if (mesaId && mesaId.includes(' + ')) {
      const subMesasOriginales = mesaId.split(' + ').map(m => m.trim());
      
      setMesas(prevMesas => {
        const mesasRestauradas = subMesasOriginales.map(idOriginal => ({
          id: idOriginal,
          estado: 'Libre',
          personas: 4,
          tiempo: '0 min en mesa',
          moza: 'Lucía P.',
          orden: '#0' + Math.floor(1000 + Math.random() * 9000),
          items: [],
          subtotal: 0,
          igv: 0,
          total: 0
        }));

        const sinLaCombinada = prevMesas.filter(m => m.id !== mesaId);
        return [...sinLaCombinada, ...mesasRestauradas];
      });

      alert(`¡Mesa combinada ${mesaId} cobrada con éxito! Las mesas originales han sido separadas y liberadas.`);
    } else {
      const actualizadas = mesas.map(m => {
        if (m.id === mesaId) {
          return { ...m, estado: 'Libre', items: [], subtotal: 0, igv: 0, total: 0 };
        }
        return m;
      });
      setMesas(actualizadas);
      alert(`¡${mesaId} cobrada y cerrada exitosamente!`);
    }

    setMesaSeleccionada(null);
    setModalCobroAbierto(false);
    setMontoPaga('');
  };

  return (
    <div className="salon-container">
      
      {/* SECCIÓN PRINCIPAL IZQUIERDA */}
      <div className="salon-main">
        
        {/* FILTROS SUPERIORES */}
        <div className="salon-header">
          <div className="salon-filters">
            <button 
              onClick={() => setFiltroEstado('TODAS')}
              className={`filter-btn ${filtroEstado === 'TODAS' ? 'filter-btn-todas' : 'filter-btn-inactive'}`}>
              Todas <span className="badge-todas">{totalMesas}</span>
            </button>
            <button 
              onClick={() => setFiltroEstado('LIBRE')}
              className={`filter-btn ${filtroEstado === 'LIBRE' ? 'filter-btn-libre' : 'filter-btn-inactive'}`}>
              Libre <span className="badge-libre">{libresCount}</span>
            </button>
            <button 
              onClick={() => setFiltroEstado('OCUPADA')}
              className={`filter-btn ${filtroEstado === 'OCUPADA' ? 'filter-btn-ocupada' : 'filter-btn-inactive'}`}>
              Ocupada <span className="badge-ocupada">{ocupadasCount}</span>
            </button>
            <button 
              onClick={() => setFiltroEstado('POR_COBRAR')}
              className={`filter-btn ${filtroEstado === 'POR_COBRAR' ? 'filter-btn-cobrar' : 'filter-btn-inactive'}`}>
              Por cobrar <span className="badge-cobrar">{porCobrarCount}</span>
            </button>
          </div>

          <button 
            onClick={() => setMostrarModalNuevaMesa(true)}
            className="btn-nueva-mesa">
            + Nueva mesa
          </button>
        </div>

        {/* GRILLA DE TARJETAS DE MESAS */}
        <div className="mesas-grid">
          {mesasFiltradas.map(m => {
            const isSelected = mesaSeleccionada?.id === m.id;
            const isOcupada = m.estado === 'Ocupada' || m.estado === 'Por cobrar';
            return (
              <div 
                key={m.id}
                onClick={() => setMesaSeleccionada(m)}
                className="mesa-card"
                style={{
                  border: isSelected ? '2px solid #ea580c' : '1px solid #e2e8f0',
                  borderTop: `4px solid ${isOcupada ? '#ea580c' : '#22c55e'}`
                }}
              >
                <div className="mesa-card-header">
                  <span className="mesa-card-title">{m.id}</span>
                  <span style={{ color: '#94a3b8', fontSize: '18px' }}>•••</span>
                </div>

                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <div className="mesa-icon-container" style={{ 
                    background: isOcupada ? '#ffedd5' : '#dcfce7', 
                    color: isOcupada ? '#ea580c' : '#15803d'
                  }}>
                    🪑
                  </div>
                </div>

                <div className="mesa-card-footer">
                  <span>{m.personas || 4} personas</span>
                  <strong style={{ color: isOcupada ? '#1e293b' : '#15803d' }}>
                    {isOcupada ? `S/ ${(m.total || 0).toFixed(2)}` : 'Libre'}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* PANEL LATERAL DERECHO */}
      {mesaSeleccionada ? (
        <div className="sidebar-container salon-sidebar">
          
          <div className="sidebar-header">
            <h2 className="sidebar-title">{mesaSeleccionada.id}</h2>
            <span className={mesaSeleccionada.estado === 'Ocupada' ? 'sidebar-badge-ocupada' : 'sidebar-badge-libre'}>
              {mesaSeleccionada.estado}
            </span>
          </div>
          <p className="sidebar-subtitle">
            Moza: {mesaSeleccionada.moza || 'Lucía P.'} • Orden {mesaSeleccionada.orden || '#0158'}
          </p>

          <hr className="sidebar-divider" />

          {/* LISTA DE ITEMS */}
          <div className="sidebar-items-list">
            {(!mesaSeleccionada.items || mesaSeleccionada.items.length === 0) ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginTop: '40px' }}>Mesa sin productos en la orden</p>
            ) : (
              mesaSeleccionada.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <div className="item-row-header">
                    <span>{item.nombre}</span>
                    <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                  <div className="item-detail">{item.detalle}</div>
                  <div className="item-controls">
                    <button onClick={() => cambiarCantidadItem(idx, -1)} className="qty-btn">-</button>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.cantidad}</span>
                    <button onClick={() => cambiarCantidadItem(idx, 1)} className="qty-btn">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SELECTOR DE PRODUCTOS */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>AÑADIR PLATO / BEBIDA:</label>
            <select 
              onChange={(e) => {
                const prod = productos.find(p => p.id.toString() === e.target.value);
                if (prod) agregarProductoAMesa(prod);
                e.target.value = "";
              }}
              defaultValue=""
              className="select-producto"
            >
              <option value="" disabled>Selecciona un producto del menú...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - S/ {parseFloat(p.precioVenta ?? p.precio ?? 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <hr className="sidebar-divider" />

          {/* TOTALES */}
          <div className="totales-row">
            <span>Subtotal</span>
            <span>S/ {(mesaSeleccionada.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="totales-row" style={{ marginBottom: '12px' }}>
            <span>IGV (18%)</span>
            <span>S/ {(mesaSeleccionada.igv || 0).toFixed(2)}</span>
          </div>
          <div className="totales-row-total">
            <span>Total</span>
            <span style={{ color: '#ea580c' }}>S/ {(mesaSeleccionada.total || 0).toFixed(2)}</span>
          </div>

          {/* ACCIONES INFERIORES */}
          <div className="sidebar-actions">
            <button className="btn-dividir">
              Dividir cuenta
            </button>
            <button 
              onClick={() => setModalCobroAbierto(true)}
              className="btn-cobrar">
              Cobrar y cerrar
            </button>
          </div>

        </div>
      ) : (
        <div className="sidebar-vacio">
          Selecciona una mesa a la izquierda para ver su orden activa y gestionar productos.
        </div>
      )}

      {/* MODAL NUEVA MESA */}
      {mostrarModalNuevaMesa && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Agregar Nueva Mesa</h3>
            <form onSubmit={handleCrearMesa}>
              <input 
                type="text" 
                placeholder="Ej. Mesa 13 o Terraza 3" 
                value={nombreNuevaMesa}
                onChange={(e) => setNombreNuevaMesa(e.target.value)}
                className="modal-input"
                autoFocus
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setMostrarModalNuevaMesa(false)} className="btn-cancelar">Cancelar</button>
                <button type="submit" className="btn-confirmar">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL COBRO */}
      {modalCobroAbierto && mesaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content-cobro">
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Cobrar Cuenta - {mesaSeleccionada.id}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Total a cancelar: <strong style={{ color: '#ea580c', fontSize: '16px' }}>S/ {mesaSeleccionada.total.toFixed(2)}</strong></p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Método de pago:</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className="modal-input">
                <option value="EFECTIVO">Efectivo</option>
                <option value="YAPE">Yape / Plin</option>
                <option value="TARJETA">Tarjeta / POS</option>
              </select>
            </div>

            {metodoPago === 'EFECTIVO' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Efectivo recibido (S/):</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={montoPaga} 
                  onChange={(e) => setMontoPaga(e.target.value)}
                  className="modal-input" 
                />
                {montoPaga && (
                  <p style={{ fontSize: '14px', marginTop: '6px', fontWeight: 'bold', color: parseFloat(montoPaga) >= mesaSeleccionada.total ? '#15803d' : '#b91c1c' }}>
                    Vuelto: S/ {Math.max(0, parseFloat(montoPaga) - mesaSeleccionada.total).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            <div className="modal-buttons">
              <button onClick={() => setModalCobroAbierto(false)} className="btn-cancelar">Cancelar</button>
              <button onClick={cobrarMesa} className="btn-confirmar-pago">Confirmar Pago</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}