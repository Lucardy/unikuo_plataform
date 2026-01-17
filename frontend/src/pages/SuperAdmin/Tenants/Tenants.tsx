import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { Tenant } from '../../../services/superAdmin.service';
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';
import { FaStore, FaEdit, FaCheck, FaTimes, FaCog } from 'react-icons/fa';
import './Tenants.css';

const Tenants: React.FC = () => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [configForm, setConfigForm] = useState<any>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await apiService.getTenants();
            if (response.success && response.data) {
                setTenants(response.data);
            }
        } catch (error) {
            console.error('Error al cargar tenants:', error);
        } finally {
            setLoading(false);
        }
    };

    const openConfigModal = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setConfigForm({
            activo: tenant.activo,
            modulos: {
                productos: true, // Defaults
                categorias: true,
                stock: true,
                reportes: true,
                ...tenant.componentes_config?.modulos
            }
        });
        setIsConfigModalOpen(true);
    };

    const handleConfigChange = (modulo: string) => {
        setConfigForm({
            ...configForm,
            modulos: {
                ...configForm.modulos,
                [modulo]: !configForm.modulos[modulo]
            }
        });
    };

    const handleActiveChange = () => {
        setConfigForm({
            ...configForm,
            activo: !configForm.activo
        });
    };

    const saveConfig = async () => {
        if (!selectedTenant) return;

        try {
            await apiService.updateTenantConfig(selectedTenant.id, {
                activo: configForm.activo,
                componentes_config: {
                    modulos: configForm.modulos
                }
            });
            setIsConfigModalOpen(false);
            loadData(); // Recargar datos
            alert('Configuración actualizada correctamente');
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            alert('Error al guardar configuración');
        }
    };

    if (loading) return <div className="loading-container">Cargando Tenants...</div>;

    return (
        <div className="tenants-page">
            <header className="tenants-header">
                <div>
                    <h1>Gestión de Tiendas (Tenants)</h1>
                    <p className="subtitle">Panel de Super Administrador</p>
                </div>
            </header>

            <div className="tenants-grid">
                {tenants.map(tenant => (
                    <div key={tenant.id} className={`tenant-card ${!tenant.activo ? 'inactive' : ''}`}>
                        <div className="tenant-card-header">
                            <div className="tenant-icon">
                                <FaStore />
                            </div>
                            <div className="tenant-status">
                                {tenant.activo ? (
                                    <span className="badge active"><FaCheck /> Activo</span>
                                ) : (
                                    <span className="badge inactive"><FaTimes /> Inactivo</span>
                                )}
                            </div>
                        </div>

                        <div className="tenant-info">
                            <h3>{tenant.nombre}</h3>
                            <p className="tenant-domain">{tenant.dominio || tenant.slug + '.unikuo.com'}</p>

                            <div className="tenant-meta">
                                <small>Propietario: {tenant.nombre_propietario || 'Sin asignar'}</small>
                            </div>
                        </div>

                        <div className="tenant-actions">
                            <Button variant="outline" onClick={() => openConfigModal(tenant)} fullWidth>
                                <FaCog /> Configurar Módulos
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                title={`Configurar: ${selectedTenant?.nombre}`}
            >
                <div className="config-form">
                    <div className="config-section">
                        <h4>Estado de la Tienda</h4>
                        <div className="switch-control">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={configForm.activo}
                                    onChange={handleActiveChange}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="switch-label">{configForm.activo ? 'Tienda Activa' : 'Tienda Inactiva'}</span>
                        </div>
                    </div>

                    <div className="config-section">
                        <h4>Módulos Habilitados</h4>
                        <p className="section-desc">Selecciona qué funcionalidades tendrá disponibles este cliente.</p>

                        <div className="modules-grid">
                            {['productos', 'categorias', 'talles', 'colores', 'marcas', 'stock', 'reportes', 'clientes', 'usuarios'].map(mod => (
                                <div key={mod} className="module-item">
                                    <label className="checkbox-container">
                                        {mod.charAt(0).toUpperCase() + mod.slice(1)}
                                        <input
                                            type="checkbox"
                                            checked={configForm.modulos?.[mod] ?? true}
                                            onChange={() => handleConfigChange(mod)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={saveConfig}>Guardar Cambios</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Tenants;
