import React, { useState } from 'react';

export default function PosView({ productos = [], mesas = [], setMesas }) {
  const [carrito, setCarrito] = useState([]);
  const [tipoVenta, setTipoVenta] = useState('mesa');
  const [mesaSeleccionada, setMesaSeleccionada] = useState(mesas[0]?.id || 'Mesa 1');
  
  const [modalMesasAbierto, setModalMesasAbierto] = useState(false);
  const [modoCombinar, setModoCombinar] = useState(false);
  const [mesasSeleccionadasParaCombinar, setMesasSeleccionadasParaCombinar] = useState([]);
  const [mesasCombinadas, setMesasCombinadas] = useState([]);

  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoConquePaga, setMontoConquePaga] = useState('');

  const agregarAlCarrito = (prod) => {
    const precioProd = parseFloat(prod.precioVenta ?? prod.precio ?? 0);
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
        return [...prevCarrito, { ...prod, precio: precioProd, cantidad: 1 }];
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
    const p = parseFloat(item.precio ?? item.precioVenta) || 0;
    const c = parseInt(item.cantidad) || 0;
    return acc + (p * c);
  }, 0);

  const dineroCliente = parseFloat(montoConquePaga) || 0;
  const vuelto = dineroCliente >= totalPagar ? dineroCliente - totalPagar : 0;

  const handleToggleSeleccionCombinar = (mesaId) => {
    if (mesasSeleccionadasParaCombinar.includes(mesaId)) {
      setMesasSeleccionadasParaCombinar(mesasSeleccionadasParaCombinar.filter(id => id !== mesaId));
    } else {
      setMesasSeleccionadasParaCombinar([...mesasSeleccionadasParaCombinar, mesaId]);
    }
  };

  const confirmarCombinacion = () => {
    if (mesasSeleccionadasParaCombinar.length < 2) {
      alert("Selecciona al menos 2 mesas para combinar.");
      return;
    }
    
    const seleccionOrdenada = [...mesasSeleccionadasParaCombinar].sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    const nombreCombinado = seleccionOrdenada.join(' + ');

    if (mesasCombinadas.some(c => c.id === nombreCombinado)) {
      alert("Estas mesas ya se encuentran combinadas.");
      return;
    }
    
    const nuevaCombinacion = {
      id: nombreCombinado,
      estado: 'Ocupada',
      subMesas: [...seleccionOrdenada],
      items: [],
      subtotal: 0,
      igv: 0,
      total: 0
    };

    setMesas(prevMesas => {
      const mesasFiltradas = prevMesas.filter(m => !seleccionOrdenada.includes(m.id));
      return [...mesasFiltradas, nuevaCombinacion];
    });

    setMesasCombinadas(prev => [...prev, { id: nombreCombinado, subMesas: [...seleccionOrdenada] }]);
    setMesaSeleccionada(nombreCombinado);
    setMesasSeleccionadasParaCombinar([]);
    setModoCombinar(false);
    setModalMesasAbierto(false);
  };

  const sacarMesaDeCombinacion = (combinacionId, mesaASacar) => {
    const comb = mesasCombinadas.find(c => c.id === combinacionId);
    if (!comb) return;

    const subMesasRestantes = comb.subMesas.filter(m => m !== mesaASacar);
    
    setMesas(prevMesas => [
      ...prevMesas,
      { id: mesaASacar, estado: 'Libre', items: [], subtotal: 0, total: 0 }
    ]);

    if (subMesasRestantes.length <= 1) {
      setMesas(prevMesas => prevMesas.filter(m => m.id !== combinacionId));
      setMesasCombinadas(mesasCombinadas.filter(c => c.id !== combinacionId));
      setMesaSeleccionada(subMesasRestantes[0] || mesas[0]?.id || 'Mesa 1');
    } else {
      const nuevoNombre = subMesasRestantes.join(' + ');
      setMesas(prevMesas => prevMesas.map(m => {
        if (m.id === combinacionId) {
          return { ...m, id: nuevoNombre, subMesas: subMesasRestantes };
        }
        return m;
      }));
      setMesasCombinadas(mesasCombinadas.map(c => {
        if (c.id === combinacionId) {
          return { ...c, id: nuevoNombre, subMesas: subMesasRestantes };
        }
        return c;
      }));
      setMesaSeleccionada(nuevoNombre);
    }
  };

  // ACCIÓN DESDE EL POS: Enviar a mesa (si es En Mesa) o Cobrar directo (si es Para Llevar)
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
      // EN MESA: Solo envía/acumula los platos en la orden de la mesa seleccionada
      setMesas(prevMesas => {
        const existeMesa = prevMesas.some(m => m.id === mesaSeleccionada);
        if (!existeMesa) {
          prevMesas.push({
            id: mesaSeleccionada,
            estado: 'Ocupada',
            items: [],
            subtotal: 0,
            igv: 0,
            total: 0
          });
        }

        return prevMesas.map(m => {
          if (m.id === mesaSeleccionada) {
            let nuevosItems = [...(m.items || [])];
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

            const subtotalCalculado = nuevosItems.reduce((acc, curr) => acc + ((curr.precio ?? curr.precioVenta ?? 0) * curr.cantidad), 0);
            const igvCalculado = subtotalCalculado * 0.18;
            const totalCalculado = subtotalCalculado + igvCalculado;

            return {
              ...m,
              estado: 'Ocupada',
              items: nuevosItems,
              subtotal: subtotalCalculado,
              igv: igvCalculado,
              total: totalCalculado
            };
          }
          return m;
        });
      });

      alert(`¡Pedido enviado correctamente a ${mesaSeleccionada}! (Dirígete a Control de Mesas para cobrar y cerrar cuando desees).`);
      setCarrito([]);
      setMontoConquePaga('');
    }
  };

  const mesasIndividualesVisibles = mesas.filter(m => {
    return !mesasCombinadas.some(comb => comb.subMesas.includes(m.id));
  });

  const listaMesasTotal = [
    ...mesasIndividualesVisibles,
    ...mesasCombinadas.map(c => ({ id: c.id, estado: 'Ocupada' }))
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'Inter, sans-serif', background: '#f8fafc', padding: '4px' }}>
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', minWidth: 0 }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>Punto de Venta (POS)</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Haz clic en los platos para agregarlos al pedido</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {productos.map(p => {
            const precioProd = parseFloat(p.precioVenta ?? p.precio ?? 0);
            return (
              <div 
                key={p.id} 
                onClick={() => agregarAlCarrito(p)} 
                style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', cursor: 'pointer', border: '2px solid transparent', textAlign: 'center', userSelect: 'none', transition: 'all 0.2s' }}
              >
                <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '15px', fontWeight: '600' }}>{p.nombre}</h4>
                <p style={{ margin: 0, color: '#ea580c', fontWeight: '700', fontSize: '16px' }}>S/ {precioProd.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN DERECHA: CARRITO Y ACCIONES */}
      <div style={{ width: '360px', minWidth: '360px', maxWidth: '360px', background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', height: '100%', overflowY: 'auto', border: '1px solid #f1f5f9' }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>Pedido Actual</h3>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button onClick={() => setTipoVenta('mesa')} style={{ flex: 1, padding: '8px', background: tipoVenta === 'mesa' ? '#ea580c' : 'transparent', color: tipoVenta === 'mesa' ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>En Mesa</button>
            <button onClick={() => setTipoVenta('llevar')} style={{ flex: 1, padding: '8px', background: tipoVenta === 'llevar' ? '#ea580c' : 'transparent', color: tipoVenta === 'llevar' ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Para Llevar</button>
          </div>

          {tipoVenta === 'mesa' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Mesa Seleccionada:</label>
              <div onClick={() => { setModoCombinar(false); setModalMesasAbierto(true); }} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                <span>🪑 {mesaSeleccionada}</span>
                <span style={{ color: '#64748b', fontSize: '12px' }}>▼</span>
              </div>
            </div>
          )}

          {tipoVenta === 'llevar' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Método de Pago:</label>
              <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', color: '#1e293b' }}>
                <option value="EFECTIVO">Efectivo</option>
                <option value="YAPE">Yape / Plin</option>
                <option value="TARJETA">Tarjeta / POS</option>
              </select>
            </div>
          )}

          {tipoVenta === 'llevar' && metodoPago === 'EFECTIVO' && (
            <div style={{ marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>Cliente paga con (S/):</label>
              <input type="number" placeholder="Ej: 300" value={montoConquePaga} onChange={e => setMontoConquePaga(e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', fontWeight: '600' }} />
              {montoConquePaga !== '' && (
                <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: '700', color: dineroCliente >= totalPagar ? '#15803d' : '#b91c1c' }}>
                  Vuelto: S/ {vuelto.toFixed(2)}
                </div>
              )}
            </div>
          )}

          <div style={{ minHeight: '140px', maxHeight: '220px', overflowY: 'auto', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', marginBottom: '10px' }}>
            {carrito.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '13px', marginTop: '50px' }}>El carrito está vacío</p>
            ) : (
              carrito.map(item => {
                const precioItem = parseFloat(item.precio ?? item.precioVenta ?? 0);
                return (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '13px', color: '#334155' }}>
                    <div><b>{item.cantidad}x</b> {item.nombre}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '700', color: '#1e293b' }}>S/ {(precioItem * item.cantidad).toFixed(2)}</span>
                      <button onClick={() => disminuirCantidad(item.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
            <span>Total a Pagar:</span>
            <span style={{ color: '#ea580c' }}>S/ {totalPagar.toFixed(2)}</span>
          </div>

          {/* ÚNICO BOTÓN PRINCIPAL DEL POS: Envía a mesa si es en mesa, o cobra si es para llevar */}
          <button onClick={procesarAccion} style={{ width: '100%', background: tipoVenta === 'mesa' ? '#2563eb' : '#ea580c', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
            {tipoVenta === 'mesa' ? '🪑 Enviar Pedido a Mesa' : '💰 Cobrar Pedido (Para Llevar)'}
          </button>
        </div>
      </div>

      {/* MODAL DE SELECCIÓN DE MESAS Y COMBINACIÓN */}
      {modalMesasAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#ffffff', width: '500px', maxWidth: '90%', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '85vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>{modoCombinar ? 'Selecciona mesas a combinar' : 'Selecciona una Mesa'}</h3>
              <button onClick={() => setModalMesasAbierto(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
              {listaMesasTotal.map(m => {
                const isSelectedForCombine = mesasSeleccionadasParaCombinar.includes(m.id);
                return (
                  <div 
                    key={m.id}
                    style={{ background: modoCombinar && isSelectedForCombine ? '#eff6ff' : '#f8fafc', border: `2px solid ${modoCombinar && isSelectedForCombine ? '#2563eb' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    onClick={() => {
                      if (modoCombinar) {
                        handleToggleSeleccionCombinar(m.id);
                      } else {
                        setMesaSeleccionada(m.id);
                        setModalMesasAbierto(false);
                      }
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🪑</span>
                    <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px', textAlign: 'center' }}>{m.id}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '6px', background: m.estado === 'Libre' ? '#dcfce7' : '#fee2e2', color: m.estado === 'Libre' ? '#15803d' : '#b91c1c' }}>{m.estado}</span>
                  </div>
                );
              })}

              {!modoCombinar && (
                <div 
                  style={{ background: '#eff6ff', border: '2px dashed #3b82f6', borderRadius: '12px', padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  onClick={() => setModoCombinar(true)}
                >
                  <span style={{ fontSize: '20px' }}>🔗</span>
                  <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>COMBINAR</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6' }}>Unir mesas</span>
                </div>
              )}
            </div>

            {mesasCombinadas.length > 0 && !modoCombinar && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569' }}>Mesas Combinadas Activas:</h4>
                {mesasCombinadas.map(comb => (
                  <div key={comb.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>
                    <span>🔗 {comb.id}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {comb.subMesas.map(sub => (
                        <button key={sub} onClick={() => sacarMesaDeCombinacion(comb.id, sub)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
                          {sub} ✕
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {modoCombinar && (
              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <button onClick={() => { setModoCombinar(false); setMesasSeleccionadasParaCombinar([]); }} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>Cancelar</button>
                <button onClick={confirmarCombinacion} style={{ flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Aceptar Combinación</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}