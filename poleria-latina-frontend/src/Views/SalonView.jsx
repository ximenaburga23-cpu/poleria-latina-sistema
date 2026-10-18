import React, { useState, useEffect } from 'react';
import api from '../Services/api';

export default function SalonView() {
    const [mesas, setMesas] = useState([]);

    // Cargar el estado de las mesas desde Spring Boot y MySQL
    useEffect(() => {
        cargarMesas();
    }, []);

    const cargarMesas = () => {
        api.get('/mesas')
            .then(res => setMesas(res.data))
            .catch(err => console.error("Error al cargar las mesas:", err));
    };

    // Cambiar estado o aplicar el botón de seguridad ("lentes" / no pagado)
    const cambiarEstado = (id, nuevoEstado) => {
        api.put(`/mesas/${id}/estado?nuevoEstado=${nuevoEstado}`)
            .then(() => {
                cargarMesas(); // Recargamos la vista
            })
            .catch(err => console.error("Error al actualizar la mesa:", err));
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ color: '#b91c1c', margin: 0 }}>🍽️ Salón - Control de Mesas</h1>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                    <span style={{ color: '#15803d' }}>🟩 Libre</span>
                    <span style={{ color: '#b91c1c' }}>🟥 Ocupada</span>
                </div>
            </header>

            <p style={{ color: '#4b5563', marginBottom: '20px' }}>
                Haz clic en una mesa para cambiar su estado o utiliza el botón de seguridad (lentes 👓) si ocurre un incidente de no pago.
            </p>

            {/* Cuadrícula de Mesas (1 al 15) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
                {mesas.map(mesa => {
                    const isOcupada = mesa.estado === 'OCUPADA';
                    return (
                        <div 
                            key={mesa.id} 
                            style={{ 
                                background: '#fff', 
                                borderTop: `6px solid ${isOcupada ? '#b91c1c' : '#15803d'}`, 
                                borderRadius: '10px', 
                                padding: '20px', 
                                textAlign: 'center', 
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
                            }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Mesa {mesa.numero}</h3>
                            <p style={{ 
                                fontSize: '12px', 
                                fontWeight: 'bold', 
                                color: isOcupada ? '#b91c1c' : '#15803d', 
                                marginBottom: '15px' 
                            }}>
                                {mesa.estado}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {isOcupada ? (
                                    <>
                                        <button 
                                            onClick={() => cambiarEstado(mesa.id, 'LIBRE')}
                                            style={{ background: '#15803d', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                            Cobrar y Liberar
                                        </button>
                                        {/* Botón de Seguridad: Los Lentes (No Pagados / Merma) */}
                                        <button 
                                            onClick={() => {
                                                if(window.confirm(`¿Registrar incidente de NO PAGADO en la Mesa ${mesa.numero}?`)) {
                                                    cambiarEstado(mesa.id, 'LIBRE');
                                                }
                                            }}
                                            title="Registrar incidente (No pagado)"
                                            style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                            👓 No Pagado
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => cambiarEstado(mesa.id, 'OCUPADA')}
                                        style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                        Ocupar Mesa
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}