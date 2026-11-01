import React, { useState, useEffect } from 'react';
import api from '../Services/api';

export default function PersonalView() {
    const [trabajadores, setTrabajadores] = useState([]);
    const [nombre, setNombre] = useState('');
    const [puesto, setPuesto] = useState('');
    const [sueldo, setSueldo] = useState('');

    const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState('');
    const [montoAdelanto, setMontoAdelanto] = useState('');
    const [autorizadoPor, setAutorizadoPor] = useState('Mamá');
    const [resumenPago, setResumenPago] = useState(null);

    useEffect(() => {
        cargarTrabajadores();
    }, []);

    const cargarTrabajadores = () => {
        api.get('/personal/trabajadores')
            .then(res => setTrabajadores(res.data))
            .catch(err => console.error("Error al cargar trabajadores:", err));
    };

    const handleCrearTrabajador = (e) => {
        e.preventDefault();
        api.post('/personal/trabajadores/crear', { nombre, puesto, sueldoSemanal: parseFloat(sueldo) })
            .then(() => {
                alert("Trabajador registrado con éxito");
                setNombre(''); setPuesto(''); setSueldo('');
                cargarTrabajadores();
            });
    };

    const handleRegistrarAdelanto = (e) => {
        e.preventDefault();
        api.post('/personal/adelantos/registrar', {
            trabajador: { id: trabajadorSeleccionado },
            montoAdelanto: parseFloat(montoAdelanto),
            autorizadoPor
        }).then(() => {
            alert("Adelanto guardado. Se descontará el día de pago.");
            setMontoAdelanto('');
            consultarResumen(trabajadorSeleccionado);
        });
    };

    const consultarResumen = (id) => {
        setTrabajadorSeleccionado(id);
        if (!id) { setResumenPago(null); return; }
        api.get(`/personal/resumen-pago/${id}`)
            .then(res => setResumenPago(res.data));
    };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px' }}>
            
            {/* ENCABEZADO AMPLIO Y CENTRADO */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '40px', marginBottom: '5px' }}>👥</div>
                <h1 style={{ color: '#b91c1c', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Control de Personal y Pagos Semanales</h1>
                <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '15px' }}>Gestión de sueldos, registro de adelantos y cálculo neto para la cajera</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                
                {/* Columna 1: Registrar Trabajador y Adelanto */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0, color: '#1f2937', fontSize: '18px', marginBottom: '15px' }}>Registrar Nuevo Trabajador</h3>
                        <form onSubmit={handleCrearTrabajador} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="text" placeholder="Nombre (Ej: María)" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} required />
                            <input type="text" placeholder="Puesto (Ej: Moza)" value={puesto} onChange={e => setPuesto(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} required />
                            <input type="number" step="0.01" placeholder="Sueldo Semanal (Ej: 100)" value={sueldo} onChange={e => setSueldo(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} required />
                            <button type="submit" style={{ backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '5px' }}>Guardar Trabajador</button>
                        </form>
                    </div>

                    <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0, color: '#1f2937', fontSize: '18px', marginBottom: '15px' }}>Registrar Adelanto (Préstamo corto)</h3>
                        <form onSubmit={handleRegistrarAdelanto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <select value={trabajadorSeleccionado} onChange={e => consultarResumen(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} required>
                                <option value="">Seleccione trabajador...</option>
                                {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre} ({t.puesto})</option>)}
                            </select>
                            <input type="number" step="0.01" placeholder="Monto del adelanto (Ej: 20)" value={montoAdelanto} onChange={e => setMontoAdelanto(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} required />
                            <input type="text" placeholder="Autorizado por (Ej: Mamá)" value={autorizadoPor} onChange={e => setAutorizadoPor(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} required />
                            <button type="submit" style={{ backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '5px' }}>Registrar Adelanto</button>
                        </form>
                    </div>
                </div>

                {/* Columna 2: Resumen Automático para el Día de Pago */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937', fontSize: '18px', marginBottom: '15px' }}>Cálculo para el Día de Pago (Cierre Semanal)</h3>
                    {resumenPago ? (
                        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '16px' }}>Colaborador: {resumenPago.trabajador}</h4>
                            <p style={{ margin: '8px 0', color: '#4b5563', fontSize: '15px' }}>Sueldo Semanal Acordado: <b>S/ {resumenPago.sueldoSemanal}</b></p>
                            <p style={{ margin: '8px 0', color: '#b91c1c', fontSize: '15px' }}>Menos Adelantos Registrados: <b>- S/ {resumenPago.totalAdelantos}</b></p>
                            <hr style={{ border: '0', borderTop: '1px solid #d1d5db', margin: '15px 0' }} />
                            <h2 style={{ margin: '0 0 20px 0', color: '#15803d', fontSize: '22px' }}>Total Neto a Pagar: S/ {resumenPago.saldoNetoAPagar}</h2>
                            <button onClick={() => alert("¡Pago registrado y semana cerrada para este trabajador!")} style={{ width: '100%', backgroundColor: '#1f2937', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                                Registrar Pago Finalizado
                            </button>
                        </div>
                    ) : (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 20px', fontSize: '15px' }}>Selecciona un trabajador a la izquierda para ver su cálculo exacto de pago.</p>
                    )}
                </div>

            </div>
        </div>
    );
}