import React, { useState } from 'react';

export default function ProductosView({ productos, setProductos }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Pollos');

  const agregarProducto = (e) => {
    e.preventDefault();
    if (!nombre || !precio) {
      alert("Por favor completa el nombre y el precio.");
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre,
      precio: parseFloat(precio),
      categoria
    };

    setProductos([...productos, nuevo]);
    setNombre('');
    setPrecio('');
    alert("¡Plato agregado con éxito al menú del POS!");
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h1 style={{ color: '#b91c1c', marginTop: 0 }}>🍽️ Gestión de Menú y Platos</h1>
      <p style={{ color: '#6b7280' }}>Agrega nuevos platos, bebidas o extras para que aparezcan automáticamente en el Punto de Venta.</p>

      {/* Formulario para crear plato */}
      <form onSubmit={agregarProducto} style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nombre del Plato / Bebida:</label>
          <input type="text" placeholder="Ej: Anticuchos, Ceviche" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Precio (S/):</label>
          <input type="number" step="0.01" placeholder="Ej: 20.00" value={precio} onChange={e => setPrecio(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Categoría:</label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
            <option value="Pollos">Pollos</option>
            <option value="Entradas">Entradas</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Extras">Extras</option>
          </select>
        </div>
        <button type="submit" style={{ backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '9px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          + Agregar Plato
        </button>
      </form>

      {/* Lista de Platos Actuales */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#374151' }}>Platos Registrados en el Sistema</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#374151' }}>
              <th style={{ padding: '10px' }}>Plato / Producto</th>
              <th style={{ padding: '10px' }}>Categoría</th>
              <th style={{ padding: '10px' }}>Precio</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', color: '#1f2937' }}>{p.nombre}</td>
                <td style={{ padding: '10px', color: '#6b7280' }}>{p.categoria || 'General'}</td>
                <td style={{ padding: '10px', color: '#b91c1c', fontWeight: 'bold' }}>S/ {Number(p.precio).toFixed(2)}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button onClick={() => eliminarProducto(p.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}