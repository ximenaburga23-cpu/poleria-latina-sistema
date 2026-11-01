import React, { useState } from 'react';

export default function SalonView({ mesas = [], setMesas, productos = [] }) {
  const [nuevaMesaNombre, setNuevaMesaNombre] = useState('');
  
  // Estados para el modal de cobro
  const [mesaACobrar, setMesaACobrar] = useState(null);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoConquePaga, setMontoConquePaga] = useState('');

  // Estados para el modal de "Añadir más productos a mesa ocupada"
  const [mesaParaAgregar, setMesaParaAgregar] = useState(null);

  const agregarNuevaMesa = (e) => {
    e.preventDefault();
    if (!nuevaMesaNombre) return;
    setMesas([...mesas, { id: nuevaMesaNombre, estado: 'Libre', items: [], total: 0 }]);
    setNuevaMesaNombre('');
    alert("¡Mesa agregada correctamente al salón!");
  };

  const cancelarPedidoMesa = (mesaId) => {
    if (window.confirm(`¿Estás seguro de cancelar el pedido de ${mesaId}? Los clientes se retiran.`)) {
      setMesas(mesas.map(m => m.id === mesaId ? { ...m, estado: 'Libre', items: [], total: 0 } : m));
    }
  };

  const abrirModalCobro = (mesa) => {
    setMesaACobrar(mesa);
    setMetodoPago('EFECTIVO');
    setMontoConquePaga('');
  };

  const confirmarCobro = () => {
    if (!mesaACobrar) return;

    const dineroCliente = parseFloat(montoConquePaga) || 0;
    if (metodoPago === 'EFECTIVO' && dineroCliente < mesaACobrar.total) {
      alert("El monto con el que paga el cliente es menor al total a pagar.");
      return;
    }

    const vuelto = dineroCliente >= mesaACobrar.total ? dineroCliente - mesaACobrar.total : 0;

    alert(`¡Cuenta de ${mesaACobrar.id} cobrada con éxito!\nTotal Pagado: S/ ${mesaACobrar.total.toFixed(2)}\nMétodo: ${metodoPago}\n${metodoPago === 'EFECTIVO' ? `Vuelto entregado: S/ ${vuelto.toFixed(2)}` : ''}`);

    setMesas(mesas.map(m => m.id === mesaACobrar.id ? { ...m, estado: 'Libre', items: [], total: 0 } : m));
    setMesaACobrar(null);
  };

  const agregarProductoAMesaDirecto = (prod) => {
    if (!mesaParaAgregar) return;

    setMesas(mesas.map(m => {
      if (m.id === mesaParaAgregar.id) {
        const existeIndex = m.items.findIndex(it => it.id === prod.id);
        let nuevosItems = [...m.items];
        if (existeIndex !== -1) {
          nuevosItems[existeIndex] = {
            ...nuevosItems[existeIndex],
            cantidad: nuevosItems[existeIndex].cantidad + 1
          };
        } else {
          nuevosItems.push({ ...prod, cantidad: 1 });
        }
        const nuevoTotal = m.total + parseFloat(prod.precio || 0);
        return { ...m, items: nuevosItems, total: nuevoTotal };
      }
      return m;
    }));

    setMesaParaAgregar(prev => ({
      ...prev,
      items: prev.items.some(it => it.id === prod.id)
        ? prev.items.map(it => it.id === prod.id ? { ...it, cantidad: it.cantidad + 1 } : it)
        : [...prev.items, { ...prod, cantidad: 1 }],
      total: prev.total + parseFloat(prod.precio || 0)
    }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', position: 'relative' }}>
      <h1 style={{ color: '#b91c1c', marginTop: 0 }}>🪑 Control de Mesas y Salón</h1>
      <p style={{ color: '#6b7280' }}>Visualiza los pedidos activos, añade extras directamente a una mesa ocupada, cobra o cancela cuentas.</p>

      {/* Formulario para añadir nuevas mesas */}
      <form onSubmit={agregarNuevaMesa} style={{ background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Nombre de mesa (Ej: Mesa VIP 1, Terraza 2)" 
          value={nuevaMesaNombre} 
          onChange={e => setNuevaMesaNombre(e.target.value)} 
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
        />
        <button type="submit" style={{ backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '9px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          + Añadir Nueva Mesa
        </button>
      </form>

      {/* Contenedores de las Mesas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {mesas.map(m => (
          <div key={m.id} style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderTop: `5px solid ${m.estado === 'Ocupada' ? '#b91c1c' : '#15803d'}`, padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#1f2937' }}>{m.id}</h3>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: m.estado === 'Ocupada' ? '#fee2e2' : '#dcfce7', color: m.estado === 'Ocupada' ? '#b91c1c' : '#15803d' }}>
                  {m.estado}
                </span>
              </div>

              <div style={{ minHeight: '90px', maxHeight: '140px', overflowY: 'auto', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '8px 0', marginBottom: '10px' }}>
                {m.items.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: '30px 0' }}>Mesa libre / Sin pedidos</p>
                ) : (
                  m.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                      <span>{item.cantidad}x {item.nombre}</span>
                      <span style={{ fontWeight: 'bold' }}>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                <span>Total a Pagar:</span>
                <span style={{ color: '#b91c1c' }}>S/ {m.total.toFixed(2)}</span>
              </div>

              {/* Botones de acción */}
              {m.estado === 'Ocupada' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button onClick={() => setMesaParaAgregar(m)} style={{ backgroundColor: '#1e40af', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                    ➕ Añadir Producto Extra
                  </button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => cancelarPedidoMesa(m.id)} style={{ flex: 1, backgroundColor: '#9ca3af', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                      ❌ Cancelar
                    </button>
                    <button onClick={() => abrirModalCobro(m)} style={{ flex: 1, backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                      💰 Cobrar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', padding: '4px' }}>Mesa disponible</div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* MODAL PARA AÑADIR PRODUCTOS DIRECTO A MESA OCUPADA */}
      {mesaParaAgregar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '500px', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
            <h2 style={{ marginTop: 0, color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', fontSize: '18px' }}>
              AÑADIR EXTRA A {mesaParaAgregar.id.toUpperCase()}
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>Haz clic en cualquier producto para sumarlo inmediatamente a la cuenta:</p>

            {/* GRILLA DE PRODUCTOS CLICKEABLES DENTRO DEL MODAL */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '250px', overflowY: 'auto', margin: '10px 0', padding: '5px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#f9fafb' }}>
              {productos.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => agregarProductoAMesaDirecto(p)} 
                  style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{p.nombre}</div>
                  <div style={{ color: '#b91c1c', fontSize: '13px', marginTop: '4px' }}>S/ {parseFloat(p.precio || 0).toFixed(2)}</div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px', background: '#e0f2fe', padding: '10px', borderRadius: '6px', color: '#0369a1' }}>
              <span>Nuevo Total de la Mesa:</span>
              <span>S/ {mesaParaAgregar.total.toFixed(2)}</span>
            </div>

            <button onClick={() => setMesaParaAgregar(null)} style={{ width: '100%', backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              Terminar / Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE COBRO PROFESIONAL */}
      {mesaACobrar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '400px', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
            
            <h2 style={{ marginTop: 0, color: '#b91c1c', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
              CUENTA {mesaACobrar.id.toUpperCase()}
            </h2>

            <div style={{ margin: '15px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>PEDIDO:</h4>
              <div style={{ maxHeight: '120px', overflowY: 'auto', background: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                {mesaACobrar.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                    <span>{it.cantidad}x {it.nombre}</span>
                    <span style={{ fontWeight: 'bold' }}>S/ {(it.precio * it.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>TIPO DE PAGO:</label>
              <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}>
                <option value="EFECTIVO">Efectivo</option>
                <option value="YAPE">Yape / Plin</option>
                <option value="TARJETA">Tarjeta / POS</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', background: '#fee2e2', padding: '10px', borderRadius: '6px', color: '#b91c1c' }}>
              <span>MONTO A PAGAR:</span>
              <span>S/ {mesaACobrar.total.toFixed(2)}</span>
            </div>

            {metodoPago === 'EFECTIVO' && (
              <div style={{ marginBottom: '20px', background: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>CLIENTE PAGA CON (S/):</label>
                <input 
                  type="number" 
                  placeholder="Ej: 100" 
                  value={montoConquePaga} 
                  onChange={e => setMontoConquePaga(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '15px', fontWeight: 'bold', boxSizing: 'border-box' }} 
                />
                {montoConquePaga !== '' && (
                  <div style={{ marginTop: '8px', fontSize: '15px', color: parseFloat(montoConquePaga) >= mesaACobrar.total ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
                    VUELTO: S/ {(parseFloat(montoConquePaga) >= mesaACobrar.total ? parseFloat(montoConquePaga) - mesaACobrar.total : 0).toFixed(2)}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setMesaACobrar(null)} style={{ flex: 1, backgroundColor: '#9ca3af', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Cerrar
              </button>
              <button onClick={confirmarCobro} style={{ flex: 1, backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Confirmar Cobro
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}