import { useState, useEffect } from 'react';
import { useCashRegister } from '../../../hooks/useCashRegister';
import './CashRegisterPage.css';

/**
 * Página de Gestión de Caja (Arqueo)
 */
const CashRegisterPage = () => {
    const {
        currentShift,
        loading,
        summary,
        openShift,
        closeShift,
        getHistory,
        getShiftDetails,
        hasOpenShift,
        canOpenShift,
    } = useCashRegister();

    const [showOpenModal, setShowOpenModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [montoInicial, setMontoInicial] = useState('');
    const [efectivoReal, setEfectivoReal] = useState('');
    const [notas, setNotas] = useState('');
    const [historial, setHistorial] = useState<any[]>([]);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);

    /**
     * Cargar historial
     */
    useEffect(() => {
        cargarHistorial();
    }, []);

    const cargarHistorial = async () => {
        const turnos = await getHistory({ limite: 10 });
        setHistorial(turnos);
    };

    /**
     * Manejar apertura de turno
     */
    const handleOpenShift = async () => {
        try {
            const monto = parseFloat(montoInicial);
            if (isNaN(monto) || monto < 0) {
                alert('Ingresa un monto válido');
                return;
            }

            await openShift(monto);
            alert('¡Turno abierto exitosamente!');
            setShowOpenModal(false);
            setMontoInicial('');
        } catch (error: any) {
            alert(error.message || 'Error al abrir turno');
        }
    };

    /**
     * Manejar cierre de turno
     */
    const handleCloseShift = async () => {
        try {
            const monto = parseFloat(efectivoReal);
            if (isNaN(monto) || monto < 0) {
                alert('Ingresa un monto válido');
                return;
            }

            await closeShift({
                efectivo_real: monto,
                notas: notas || undefined,
            });

            alert('¡Turno cerrado exitosamente!');
            setShowCloseModal(false);
            setEfectivoReal('');
            setNotas('');
            cargarHistorial();
        } catch (error: any) {
            alert(error.message || 'Error al cerrar turno');
        }
    };

    /**
     * Ver detalles de un turno
     */
    const handleViewDetails = async (turno: any) => {
        const detalles = await getShiftDetails(turno.id);
        setTurnoSeleccionado(detalles);
        setShowDetailsModal(true);
    };

    return (
        <div className="cash-register-page">
            <div className="page-header">
                <h1>Arqueo de Caja</h1>
                {canOpenShift && (
                    <button onClick={() => setShowOpenModal(true)} className="open-shift-button">
                        Abrir Turno
                    </button>
                )}
            </div>

            {/* Turno Actual */}
            {hasOpenShift && summary && (
                <div className="current-shift-section">
                    <h2>Turno Actual</h2>
                    <div className="shift-card active">
                        <div className="shift-header">
                            <div>
                                <h3>Turno #{currentShift?.id.substring(0, 8)}</h3>
                                <p className="shift-date">
                                    Apertura: {new Date(currentShift?.fecha_apertura || '').toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => setShowCloseModal(true)} className="close-shift-button">
                                Cerrar Turno
                            </button>
                        </div>

                        <div className="shift-stats">
                            <div className="stat-card">
                                <span className="stat-label">Monto Inicial</span>
                                <span className="stat-value">${summary.monto_inicial?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Total Ventas</span>
                                <span className="stat-value">${summary.total_ventas?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Efectivo</span>
                                <span className="stat-value">${summary.total_efectivo?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Transferencias</span>
                                <span className="stat-value">${summary.total_transferencia?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Tarjetas</span>
                                <span className="stat-value">${summary.total_tarjeta?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="stat-card highlight">
                                <span className="stat-label">Efectivo Esperado</span>
                                <span className="stat-value">${summary.efectivo_esperado?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>

                        <div className="sales-count">
                            <p>Número de ventas: {summary.cantidad_ventas || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Historial */}
            <div className="history-section">
                <h2>Historial de Turnos</h2>
                {historial.length === 0 ? (
                    <div className="no-history">No hay turnos cerrados</div>
                ) : (
                    <div className="history-grid">
                        {historial.map((turno) => (
                            <div key={turno.id} className="shift-card">
                                <div className="shift-info">
                                    <h3>Turno #{turno.id.substring(0, 8)}</h3>
                                    <p className="shift-date">
                                        {new Date(turno.fecha_apertura).toLocaleDateString()}
                                    </p>
                                    <p className="shift-user">
                                        {turno.nombre_usuario} {turno.apellido_usuario}
                                    </p>
                                </div>
                                <div className="shift-summary">
                                    <div className="summary-item">
                                        <span>Total Ventas:</span>
                                        <span>${turno.total_ventas?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Diferencia:</span>
                                        <span className={(turno.diferencia || 0) >= 0 ? 'positive' : 'negative'}>
                                            ${turno.diferencia?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => handleViewDetails(turno)} className="details-button">
                                    Ver Detalles
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Abrir Turno */}
            {showOpenModal && (
                <div className="modal-overlay" onClick={() => setShowOpenModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Abrir Turno de Caja</h2>
                        <div className="form-group">
                            <label>Monto Inicial en Efectivo:</label>
                            <input
                                type="number"
                                value={montoInicial}
                                onChange={(e) => setMontoInicial(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="form-input"
                                autoFocus
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowOpenModal(false)} className="cancel-button">
                                Cancelar
                            </button>
                            <button onClick={handleOpenShift} className="confirm-button" disabled={loading}>
                                {loading ? 'Abriendo...' : 'Abrir Turno'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Cerrar Turno */}
            {showCloseModal && summary && (
                <div className="modal-overlay" onClick={() => setShowCloseModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Cerrar Turno de Caja</h2>

                        <div className="close-summary">
                            <h3>Resumen del Turno</h3>
                            <div className="summary-row">
                                <span>Monto Inicial:</span>
                                <span>${summary.monto_inicial?.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Total Ventas:</span>
                                <span>${summary.total_ventas?.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Efectivo en Ventas:</span>
                                <span>${summary.total_efectivo?.toFixed(2)}</span>
                            </div>
                            <div className="summary-row highlight">
                                <span>Efectivo Esperado:</span>
                                <span>${summary.efectivo_esperado?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Efectivo Real en Caja:</label>
                            <input
                                type="number"
                                value={efectivoReal}
                                onChange={(e) => setEfectivoReal(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="form-input"
                                autoFocus
                            />
                        </div>

                        {efectivoReal && (
                            <div className="difference-display">
                                <span>Diferencia:</span>
                                <span className={
                                    (parseFloat(efectivoReal) - (summary.efectivo_esperado || 0)) >= 0
                                        ? 'positive'
                                        : 'negative'
                                }>
                                    ${(parseFloat(efectivoReal) - (summary.efectivo_esperado || 0)).toFixed(2)}
                                </span>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Observaciones (opcional):</label>
                            <textarea
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                placeholder="Notas sobre el cierre..."
                                className="form-textarea"
                                rows={3}
                            />
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setShowCloseModal(false)} className="cancel-button">
                                Cancelar
                            </button>
                            <button onClick={handleCloseShift} className="confirm-button" disabled={loading}>
                                {loading ? 'Cerrando...' : 'Cerrar Turno'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalles */}
            {showDetailsModal && turnoSeleccionado && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <h2>Detalles del Turno</h2>

                        <div className="details-section">
                            <h3>Información General</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span>Usuario:</span>
                                    <span>{turnoSeleccionado.nombre_usuario} {turnoSeleccionado.apellido_usuario}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Apertura:</span>
                                    <span>{new Date(turnoSeleccionado.fecha_apertura).toLocaleString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Cierre:</span>
                                    <span>{turnoSeleccionado.fecha_cierre ? new Date(turnoSeleccionado.fecha_cierre).toLocaleString() : 'Abierto'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="details-section">
                            <h3>Montos</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span>Monto Inicial:</span>
                                    <span>${turnoSeleccionado.monto_inicial?.toFixed(2)}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Total Ventas:</span>
                                    <span>${turnoSeleccionado.total_ventas?.toFixed(2)}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Efectivo Esperado:</span>
                                    <span>${turnoSeleccionado.efectivo_esperado?.toFixed(2)}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Efectivo Real:</span>
                                    <span>${turnoSeleccionado.efectivo_real?.toFixed(2)}</span>
                                </div>
                                <div className="detail-item highlight">
                                    <span>Diferencia:</span>
                                    <span className={(turnoSeleccionado.diferencia || 0) >= 0 ? 'positive' : 'negative'}>
                                        ${turnoSeleccionado.diferencia?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {turnoSeleccionado.notas && (
                            <div className="details-section">
                                <h3>Observaciones</h3>
                                <p>{turnoSeleccionado.notas}</p>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={() => setShowDetailsModal(false)} className="confirm-button">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashRegisterPage;
