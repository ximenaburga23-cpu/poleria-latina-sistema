import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import '../Styles/ProductosView.css';

export default function ProductosView() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('POLLOS');
  const [editandoId, setEditandoId] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !precio) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const productoData = {
      nombre: nombre.toUpperCase(),
      precioVenta: parseFloat(precio),
      categoria: categoria.toUpperCase(),
      activo: true
    };

    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, productoData);
        setEditandoId(null);
      } else {
        await api.post('/productos', productoData);
      }
      setNombre('');
      setPrecio('');
      setCategoria('POLLOS');
      cargarProductos();
    } catch (error) {
      const mensajeError = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message || "El plato o bebida ya existe en el sistema o hubo un error.";
      alert(mensajeError);
    }
  };

  const iniciarEdicion = (prod) => {
    setEditandoId(prod.id);
    setNombre(prod.nombre);
    setPrecio(prod.precioVenta ?? prod.precio ?? '');
    setCategoria(prod.categoria);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre('');
    setPrecio('');
    setCategoria('POLLOS');
  };

  const toggleEstado = async (id) => {
    try {
      await api.patch(`/productos/${id}/toggle`);
      cargarProductos();
    } catch (error) {
      console.error("Error al cambiar estado", error);
    }
  };

  const productosFiltrados = productos.filter(p => {
    const coincideEstado = mostrarInactivos ? !p.activo : p.activo;
    const coincideTexto = p.nombre.includes(busqueda.toUpperCase());
    return coincideEstado && coincideTexto;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / elementosPorPagina) || 1;
  const indexUltimo = paginaActual * elementosPorPagina;
  const indexPrimero = indexUltimo - elementosPorPagina;
  const productosPaginados = productosFiltrados.slice(indexPrimero, indexUltimo);

  return (
    <div className="productos-container">
      <div className="productos-header-box">
        <h2 className="productos-title">Gestión de Menú y Platos</h2>
        <p className="productos-subtitle">Agrega, edita o desactiva platos para el Punto de Venta.</p>
      </div>

      {/* Formulario */}
      <form onSubmit={guardarProducto} className="productos-form">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Nombre del Plato / Bebida:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value.toUpperCase())}
            placeholder="EJ: 1 POLLO ENTERO"
            required
          />
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: '130px' }}>
          <label>Precio (S/):</label>
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            onBlur={() => {
              if (precio !== '') {
                setPrecio(parseFloat(precio).toFixed(2));
              }
            }}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group" style={{ flex: 1.5, minWidth: '160px' }}>
          <label>Categoría:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="POLLOS">POLLOS</option>
            <option value="ENTRADAS">ENTRADAS</option>
            <option value="BEBIDAS">BEBIDAS</option>
            <option value="BEBIDAS CALIENTES">BEBIDAS CALIENTES</option>
            <option value="JARRAS">JARRAS</option>
            <option value="EXTRAS">EXTRAS</option>
          </select>
        </div>

        <div className="form-actions-group">
          <button type="submit" className={`btn-guardar ${editandoId ? 'editando' : ''}`}>
            {editandoId ? 'Actualizar Plato' : '+ Agregar Plato'}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicion} className="btn-cancelar">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Barra de Filtros y Botón Ojo */}
      <div className="productos-acciones-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Buscar plato..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
            className="input-buscar"
          />
        </div>

        <button
          onClick={() => { setMostrarInactivos(!mostrarInactivos); setPaginaActual(1); }}
          className={`btn-ojo ${mostrarInactivos ? 'activo' : ''}`}
        >
          {mostrarInactivos ? '👁️ Viendo Inactivos' : '👁️ Ver Desactivados'}
        </button>
      </div>

      {/* Tabla */}
      <div className="tabla-card">
        <table className="productos-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Plato / Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th style={{ textAlign: 'center', width: '180px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.length > 0 ? (
              productosPaginados.map((p, index) => (
                <tr key={p.id}>
                  <td style={{ color: '#94a3b8', fontWeight: '500' }}>{indexPrimero + index + 1}</td>
                  <td style={{ fontWeight: '600', color: '#1e293b' }}>{p.nombre}</td>
                  <td>
                    <span className="categoria-badge">{p.categoria}</span>
                  </td>
                  <td className="badge-precio">S/ {p.precioVenta ? p.precioVenta.toFixed(2) : '0.00'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions">
                      <button onClick={() => iniciarEdicion(p)} className="btn-accion-editar">
                        Editar
                      </button>
                      <button
                        onClick={() => toggleEstado(p.id)}
                        className={`btn-accion-estado ${p.activo ? 'desactivar' : 'activar'}`}
                      >
                        {p.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="paginacion-footer">
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Mostrando {productosPaginados.length} de {productosFiltrados.length} registros
          </span>
          <div className="paginacion-botones">
            <button
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              &lt;
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPaginaActual(i + 1)}
                className={paginaActual === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}