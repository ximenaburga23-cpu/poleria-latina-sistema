import React from 'react';

export default function ReportesView() {

    const descargarExcelKardex = () => {
        window.open('http://localhost:8080/api/reportes/exportar/kardex', '_blank');
    };

    const descargarExcelProveedores = () => {
        window.open('http://localhost:8080/api/reportes/exportar/proveedores', '_blank');
    };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px' }}>
            
            {/* ENCABEZADO AMPLIO CON EL ICONO AL COSTADO */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <span style={{ fontSize: '42px' }}>📈</span>
                <div>
                    <h1 style={{ color: '#b91c1c', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Reportes, Exportación y Auditoría</h1>
                    <p style={{ color: '#6b7280', margin: '6px 0 0 0', fontSize: '15px' }}>Descarga de archivos Excel y control de la ventana de gracia de 24 horas</p>
                </div>
            </div>

            {/* Panel de Ventana de Gracia */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e40af', fontSize: '18px' }}>🕒 Ventana de Gracia y Revisión (24 Horas)</h3>
                <p style={{ margin: 0, color: '#1e3a8a', lineHeight: '1.6', fontSize: '15px' }}>
                    Los registros del día se mantienen activos en modo de auditoría durante 24 horas. 
                    Si tu mamá revisa las cámaras y detecta que una mesa no pagada o un método de pago fue incorrecto, 
                    la cajera puede editar el registro antes de que el sistema selle el día definitivamente.
                </p>
            </div>

            {/* Panel de Exportación */}
            <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, color: '#1f2937', fontSize: '18px', marginBottom: '10px' }}>📥 Descarga de Informes (Excel / CSV)</h3>
                <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '20px' }}>
                    Haz clic en los botones para descargar los respaldos directos de la base de datos de la pollería.
                </p>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={descargarExcelKardex} style={{ backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '14px 22px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                        📊 Descargar Kardex de Inventario (Excel)
                    </button>
                    <button onClick={descargarExcelProveedores} style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', padding: '14px 22px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                        📋 Descargar Reporte de Proveedores (Excel)
                    </button>
                </div>
            </div>

        </div>
    );
}