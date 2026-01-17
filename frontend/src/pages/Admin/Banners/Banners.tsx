import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { Banner } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';
import {
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaPen,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaTimes,
  FaLink,
  FaUpload,
  FaGripVertical,
} from 'react-icons/fa';
import './Banners.css';

const MAX_BANNERS = 6;

const Banners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ titulo: '', subtitulo: '', url_enlace: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await apiService.getBanners(true);
      if (response.success && response.data?.banners) {
        setBanners(response.data.banners);
      }
    } catch (error) {
      console.error('Error al cargar banners:', error);
      alert('Error al cargar banners');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (banner: Banner) => {
    try {
      await apiService.updateBanner(banner.id, {
        ...banner,
        activo: !banner.activo,
      });
      alert('Estado actualizado');
      fetchBanners();
    } catch (error) {
      alert('No se pudo actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (banner) {
      setBannerToDelete(banner);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await apiService.deleteBanner(bannerToDelete.id);
      alert('Banner eliminado exitosamente');
      fetchBanners();
      setShowDeleteModal(false);
      setBannerToDelete(null);
    } catch (error) {
      alert('No se pudo eliminar el banner');
    }
  };

  const handleOrder = async (id: string, delta: number) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    const newOrder = Math.max(0, (banner.orden || 0) + delta);
    try {
      await apiService.updateBanner(id, { ...banner, orden: newOrder });
      fetchBanners();
    } catch (error) {
      alert('No se pudo cambiar el orden');
    }
  };

  const handleDragStart = (id: string) => {
    setDragId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragId) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (idDestino: string) => {
    if (dragId == null || dragId === idDestino) {
      setDragId(null);
      document.querySelectorAll('.banner-card').forEach(card => {
        card.classList.remove('drag-over');
      });
      return;
    }

    const src = banners.find(b => b.id === dragId);
    const dst = banners.find(b => b.id === idDestino);
    if (!src || !dst) {
      setDragId(null);
      return;
    }

    try {
      await Promise.all([
        apiService.updateBanner(src.id, { ...src, orden: dst.orden ?? 0 }),
        apiService.updateBanner(dst.id, { ...dst, orden: src.orden ?? 0 }),
      ]);
      alert('Orden actualizado');
      fetchBanners();
    } catch (error) {
      alert('No se pudo reordenar');
    } finally {
      setDragId(null);
      document.querySelectorAll('.banner-card').forEach(card => {
        card.classList.remove('drag-over');
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (banners.length >= MAX_BANNERS) {
      alert(`Máximo ${MAX_BANNERS} banners`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Subir imagen
      const uploadResponse = await apiService.uploadBannerImage(file, (progress) => {
        setUploadProgress(progress);
      });

      if (uploadResponse.success && uploadResponse.data?.path) {
        // Crear banner
        const newBanner = {
          url_imagen: uploadResponse.data.path,
          titulo: '',
          subtitulo: '',
          url_enlace: '',
          orden: banners.length || 0,
          activo: true,
        };

        await apiService.createBanner(newBanner);
        alert('Banner creado exitosamente');
        fetchBanners();
      }
    } catch (error) {
      alert('Error al subir/crear banner');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleSaveEdit = async (banner: Banner) => {
    try {
      await apiService.updateBanner(banner.id, { ...banner, ...draft });
      alert('Banner actualizado exitosamente');
      setEditingId(null);
      fetchBanners();
    } catch (error) {
      alert('No se pudo guardar los cambios');
    }
  };

  if (loading) {
    return <div className="banners-loading">Cargando banners…</div>;
  }

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${imagePath}`;
  };

  return (
    <div className="admin-banners">
      <div className="admin-banners-header">
        <div>
          <h1>Gestión de Banners</h1>
          <p>Administra los banners del carrusel de inicio</p>
        </div>
      </div>

      <div className="banner-admin">
        <div className="banner-admin-header">
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <h3>Administrar Banners</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--admin-text-secondary)', fontSize: '14px' }}>
              Arrastra las tarjetas para reordenar • Máximo {MAX_BANNERS} banners
            </p>
          </div>
          <label className={`upload-btn ${uploading ? 'disabled' : ''}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading || banners.length >= MAX_BANNERS}
            />
            <FaUpload />
            {uploading ? `Subiendo… ${uploadProgress}%` : 'Subir Banner'}
          </label>
        </div>

        {uploading && (
          <div className="upload-progress">
            <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        <div className="banners-grid">
          {banners.map(banner => {
            const imgUrl = getImageUrl(banner.url_imagen);
            const isEditing = editingId === banner.id;

            return (
              <div
                key={banner.id}
                className={`banner-card ${dragId === banner.id ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(banner.id)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, banner.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(banner.id)}
              >
                <div className="banner-thumb">
                  <div className="drag-handle">
                    <FaGripVertical />
                  </div>
                  <img src={imgUrl} alt={banner.titulo || 'banner'} />
                  <div className="thumb-overlay" />
                  <div className="badges">
                    <span className="badge order">Orden #{banner.orden ?? 0}</span>
                    <span className={`badge estado ${banner.activo ? 'on' : 'off'}`}>
                      {banner.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="actions">
                    <button
                      title="Subir orden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrder(banner.id, -1);
                      }}
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      title="Bajar orden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrder(banner.id, 1);
                      }}
                    >
                      <FaArrowDown />
                    </button>
                    <button
                      title="Editar"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(banner.id);
                        setDraft({
                          titulo: banner.titulo || '',
                          subtitulo: banner.subtitulo || '',
                          url_enlace: banner.url_enlace || '',
                        });
                      }}
                    >
                      <FaPen />
                    </button>
                    <button
                      title={banner.activo ? 'Desactivar' : 'Activar'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(banner);
                      }}
                    >
                      {banner.activo ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      className="danger"
                      title="Eliminar"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(banner.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="edit-panel">
                    <h4>Editar Banner</h4>
                    <div className="fields">
                      <div>
                        <label>Título</label>
                        <input
                          className="field"
                          type="text"
                          placeholder="Ej: Promoción Especial"
                          value={draft.titulo}
                          onChange={(e) => setDraft(prev => ({ ...prev, titulo: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label>URL de Enlace (opcional)</label>
                        <input
                          className="field"
                          type="url"
                          placeholder="https://ejemplo.com"
                          value={draft.url_enlace}
                          onChange={(e) => setDraft(prev => ({ ...prev, url_enlace: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label>Descripción (opcional)</label>
                        <textarea
                          className="field"
                          rows={3}
                          placeholder="Descripción del banner..."
                          value={draft.subtitulo}
                          onChange={(e) => setDraft(prev => ({ ...prev, subtitulo: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button
                        className="save"
                        onClick={() => handleSaveEdit(banner)}
                      >
                        <FaSave /> Guardar Cambios
                      </button>
                      <button
                        className="cancel"
                        onClick={() => setEditingId(null)}
                      >
                        <FaTimes /> Cancelar
                      </button>
                      {draft.url_enlace && (
                        <a
                          className="link-preview"
                          href={draft.url_enlace}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <FaLink /> Ver Enlace
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="hint">
          💡 <strong>Recomendaciones:</strong> Imágenes de 1600x600px, formato JPG o PNG.
          Máximo {MAX_BANNERS} banners activos. Arrastra las tarjetas para cambiar el orden.
        </p>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBannerToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '20px', color: 'var(--admin-text-primary)' }}>
            ¿Estás seguro de que deseas eliminar este banner?
          </p>
          {bannerToDelete && (
            <div style={{
              marginBottom: '20px',
              padding: '12px',
              background: 'var(--admin-bg-tertiary)',
              borderRadius: '8px',
              border: '1px solid var(--admin-border-light)',
            }}>
              <img
                src={getImageUrl(bannerToDelete.url_imagen)}
                alt="Preview"
                style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px' }}
              />
              {bannerToDelete.titulo && (
                <p style={{ marginTop: '8px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                  {bannerToDelete.titulo}
                </p>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setBannerToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              <FaTrash /> Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Banners;
