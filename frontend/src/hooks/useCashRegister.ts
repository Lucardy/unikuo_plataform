import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

interface CashRegisterShift {
    id: string;
    usuario_id: string;
    fecha_apertura: string;
    fecha_cierre?: string;
    monto_inicial: number;
    efectivo_esperado?: number;
    efectivo_real?: number;
    diferencia?: number;
    total_ventas?: number;
    total_efectivo?: number;
    total_transferencia?: number;
    total_tarjeta?: number;
    cantidad_ventas?: number;
    estado: 'abierto' | 'cerrado' | 'cancelado';
    notas?: string;
    email_usuario?: string;
    nombre_usuario?: string;
    apellido_usuario?: string;
    ventas?: any[];
}

interface CloseShiftData {
    efectivo_real: number;
    notas?: string;
}

/**
 * Hook para gestionar el sistema de caja (apertura y cierre de turnos)
 */
export const useCashRegister = () => {
    const [currentShift, setCurrentShift] = useState<CashRegisterShift | null>(null);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<CashRegisterShift | null>(null);

    /**
     * Cargar turno abierto del usuario actual
     */
    const loadCurrentShift = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.getCurrentCashRegister();
            if (response.success) {
                const shift = response.data?.shift;
                setCurrentShift(shift);
                if (shift) {
                    setSummary(shift);
                }
            }
        } catch (error) {
            console.error('Error cargando turno abierto:', error);
            // No mostrar error si simplemente no hay turno abierto
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Abrir un nuevo turno
     */
    const openShift = useCallback(async (initialAmount: number) => {
        if (initialAmount < 0) {
            throw new Error('El monto inicial no puede ser negativo');
        }

        try {
            setLoading(true);
            const response = await apiService.openCashRegister(initialAmount);

            if (response.success) {
                await loadCurrentShift();
                return response.data?.shift;
            } else {
                throw new Error(response.message || 'Error al abrir turno');
            }
        } catch (error: any) {
            console.error('Error abriendo turno:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [loadCurrentShift]);

    /**
     * Cerrar el turno actual
     */
    const closeShift = useCallback(async (closeData: CloseShiftData) => {
        if (!currentShift) {
            throw new Error('No hay turno abierto para cerrar');
        }

        if (closeData.efectivo_real < 0) {
            throw new Error('El monto de efectivo real no puede ser negativo');
        }

        try {
            setLoading(true);
            const response = await apiService.closeCashRegister(currentShift.id, closeData);

            if (response.success) {
                setCurrentShift(null);
                setSummary(null);
                return response.data?.shift;
            } else {
                throw new Error(response.message || 'Error al cerrar turno');
            }
        } catch (error: any) {
            console.error('Error cerrando turno:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [currentShift]);

    /**
     * Cargar resumen del turno actual
     */
    const loadSummary = useCallback(async () => {
        if (!currentShift) return;

        try {
            const response = await apiService.getCashRegisterSummary(currentShift.id);
            if (response.success) {
                setSummary(response.data?.shift);
            }
        } catch (error) {
            console.error('Error cargando resumen:', error);
        }
    }, [currentShift]);

    /**
     * Obtener historial de cierres
     */
    const getHistory = useCallback(async (filtros: any = {}) => {
        try {
            const response = await apiService.getCashRegisters({ ...filtros, estado: 'cerrado' });
            if (response.success) {
                return response.data?.shifts || [];
            }
            return [];
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            return [];
        }
    }, []);

    /**
     * Obtener detalle de un turno
     */
    const getShiftDetails = useCallback(async (shiftId: string) => {
        try {
            const response = await apiService.getCashRegisterSummary(shiftId);
            if (response.success) {
                return response.data?.shift;
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo detalle:', error);
            return null;
        }
    }, []);

    /**
     * Cargar turno abierto al montar
     */
    useEffect(() => {
        loadCurrentShift();
    }, [loadCurrentShift]);

    /**
     * Actualizar resumen periódicamente si hay turno abierto
     */
    useEffect(() => {
        if (!currentShift) return;

        // Cargar resumen inicial
        loadSummary();

        // Actualizar cada 30 segundos
        const interval = setInterval(() => {
            loadSummary();
        }, 30000);

        return () => clearInterval(interval);
    }, [currentShift, loadSummary]);

    return {
        currentShift,
        loading,
        summary,
        loadCurrentShift,
        openShift,
        closeShift,
        loadSummary,
        getHistory,
        getShiftDetails,

        // Helpers
        hasOpenShift: !!currentShift,
        canOpenShift: !currentShift && !loading,
    };
};
