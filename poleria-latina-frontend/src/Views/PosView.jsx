import React, { useState } from 'react';

export default function PosView({ productos = [], mesas = [], setMesas }) {
  const [carrito, setCarrito] = useState([]);
  const [tipoVenta, setTipoVenta] = useState('mesa');
  const [mesaSeleccionada, setMesaSeleccionada] = useState(mesas[0]?.id || 'Mesa 1');
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoConquePaga, setMontoConquePaga] = useState('');

  const agregarAlCarrito = (prod) => {
    setCarrito(prevCarrito => {
      const index = prevCarrito.findIndex(item => item.id === prod.id);
      if (index !== -1) {
        const nuevoCarrito = [...prevCarrito];
        nuevoCarrito[index] = { 
          ...nuevoCarrito[index], 
          cantidad: Number(nuevoCarrito[index].cantidad || 1) + 1 
        };
        return nuevoCarrito;
      } else {
        return [...prevCarrito, { ...prod, cantidad: 1 }];
      }
    });
  };

  const disminuirCantidad = (id) => {
    setCarrito(prevCarrito => {
      return prevCarrito.map(item => {
        if (item.id === id) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      }).filter(item => item.cantidad > 0);
    });
  };

  const totalPagar = carrito.reduce((acc, item) => {
    const p = parseFloat(item.precio) || 0;
    const c = parseInt(item.cantidad) || 0;
    return acc + (p * c);
  }, 0);

  const dineroCliente = parseFloat(montoConquePaga) || 0;
  const vuelto = dineroCliente >= totalPagar ? dineroCliente - totalPagar : 0;

  const procesarAccion = () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío. Seleccione al menos un plato.");
      return;
    }

    if (tipoVenta === 'llevar') {
      if (metodoPago === 'EFECTIVO' && dineroCliente < totalPagar) {
        alert("El monto con el que paga el cliente es menor al total a pagar.");
        return;
      }
      alert(`¡Pedido Para Llevar cobrado con éxito!\nTotal: S/ ${totalPagar.toFixed(2)}\nVuelto: S/ ${vuelto.toFixed(2)}`);
      setCarrito([]);
      setMontoConquePaga('');
    } else {
      const mesaObj = mesas.find(m => m.id === mesaSeleccionada);
      
      if (mesaObj && mesaObj.estado === 'Ocupada') {
        const confirmarSuma = window.confirm(`La ${mesaSeleccionada} ya se encuentra OCUPADA con un pedido previo.\n\n¿Deseas añadir estos nuevos platos a su cuenta actual?`);
        if (!confirmarSuma) return;
      }

      setMesas(prevMesas => prevMesas.map(m => {
        if (m.id === mesaSeleccionada) {
          let nuevosItems = [...m.items];
          carrito.forEach(itemNuevo => {
            const indexExistente = nuevosItems.findIndex(it => it.id === itemNuevo.id);
            if (indexExistente !== -1) {
              nuevosItems[indexExistente] = {
                ...nuevosItems[indexExistente],
                cantidad: nuevosItems[indexExistente].cantidad + itemNuevo.cantidad
              };
            } else {
              nuevosItems.push(itemNuevo);
            }
          });

          return {
            ...m,
            estado: 'Ocupada',
            items: nuevosItems,
            total: m.total + totalPagar
          };
        }
        return m;
      }));

      alert(`¡Pedido enviado correctamente a ${mesaSeleccionada}!`);
      setCarrito([]);
      setMontoConquePaga('');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO DE PLATOS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', minWidth: 0 }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#1f2937', fontSize: '22px' }}>Punto de Venta (POS)</h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Haz clic en los platos para agregarlos al pedido</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '15px' }}>
          {productos.map(p => (
            <div 
              key={p.id} 
              onClick={() => agregarAlCarrito(p)} 
              style={{ background: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', border: '2px solid transparent', textAlign: 'center', userSelect: 'none' }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '15px' }}>{p.nombre}</h4>
              <p style={{ margin: 0, color: '#b91c1c', fontWeight: 'bold', fontSize: '16px' }}>S/ {parseFloat(p.precio || 0).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DERECHA: CARRITO Y ACCIONES */}
      <div style={{ width: '340px', minWidth: '340px', maxWidth: '340px', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', height: '100%', overflowY: 'auto' }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#1f2937', fontSize: '18px' }}>Pedido Actual</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button onClick={() => setTipoVenta('mesa')} style={{ flex: 1, padding: '6px', background: tipoVenta === 'mesa' ? '#b91c1c' : '#e5e7eb', color: tipoVenta === 'mesa' ? '#fff' : '#374151', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>En Mesa</button>
            <button onClick={() => setTipoVenta('llevar')} style={{ flex: 1, padding: '6px', background: tipoVenta === 'llevar' ? '#b91c1c' : '#e5e7eb', color: tipoVenta === 'llevar' ? '#fff' : '#374151', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>Para Llevar</button>
          </div>

          {tipoVenta === 'mesa' && (
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>Seleccionar Mesa:</label>
              <select value={mesaSeleccionada} onChange={e => setMesaSeleccionada(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #1f2937', fontSize: '13px' }}>
                {mesas.map(m => (
                  <option key={m.id} value={m.id}>{m.id} ({m.estado})</option>
                ))}
              </select>
            </div>
          )}

          {tipoVenta === 'llevar' && (
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>Método de Pago:</label>
              <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #1f2937', fontSize: '13px' }}>
                <option value="EFECTIVO">Efectivo</option>
                <option value="YAPE">Yape / Plin</option>
                <option value="TARJETA">Tarjeta / POS</option>
              </select>
            </div>
          )}

          {tipoVenta === 'llevar' && metodoPago === 'EFECTIVO' && (
            <div style={{ marginBottom: '10px', background: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>Cliente paga con (S/):</label>
              <input 
                type="number" 
                placeholder="Ej: 300" 
                value={montoConquePaga} 
                onChange={e => setMontoConquePaga(e.target.value)} 
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', fontWeight: 'bold' }} 
              />
              {montoConquePaga !== '' && (
                <div style={{ marginTop: '8px', fontSize: '14px', color: dineroCliente >= totalPagar ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
                  Vuelto: S/ {vuelto.toFixed(2)}
                </div>
              )}
            </div>
          )}

          <div style={{ minHeight: '120px', maxHeight: '180px', overflowY: 'auto', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '8px 0' }}>
            {carrito.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '13px', marginTop: '40px' }}>El carrito está vacío</p>
            ) : (
              carrito.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px' }}>
                  <div>
                    <b>{item.cantidad}x</b> {item.nombre}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>S/ {(parseFloat(item.precio || 0) * parseInt(item.cantidad || 1)).toFixed(2)}</span>
                    <button onClick={() => disminuirCantidad(item.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
            <span>Total a Pagar:</span>
            <span style={{ color: '#b91c1c' }}>S/ {totalPagar.toFixed(2)}</span>
          </div>
          <button onClick={procesarAccion} style={{ width: '100%', backgroundColor: tipoVenta === 'mesa' ? '#1d4ed8' : '#b91c1c', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            {tipoVenta === 'mesa' ? '🪑 Enviar Pedido a Mesa' : '💰 Cobrar Pedido'}
          </button>
        </div>

      </div>

    </div>
  );
}