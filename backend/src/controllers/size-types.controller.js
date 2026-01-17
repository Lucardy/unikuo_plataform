import TipoTalle from '../models/TipoTalle.js';

export const getAllSizeTypes = async (req, res) => {
    try {
        const { incluir_inactivos } = req.query;
        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Si es admin, puede ver todos los tipos de talle (clienteId = null)
        // Si no es admin, solo ve los de su cliente
        const tiposTalle = await TipoTalle.obtenerTodos(
            incluir_inactivos === 'true',
            rolesUsuario.includes('admin') ? null : clienteId
        );

        res.json({
            success: true,
            data: {
                tiposTalle,
            },
        });
    } catch (error) {
        console.error('Error al obtener tipos de talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tipos de talle',
            error: error.message,
        });
    }
};

export const getSizeTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoTalle = await TipoTalle.obtenerPorId(id);

        if (!tipoTalle) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de talle no encontrado',
            });
        }

        res.json({
            success: true,
            data: {
                tipoTalle,
            },
        });
    } catch (error) {
        console.error('Error al obtener tipo de talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tipo de talle',
            error: error.message,
        });
    }
};

export const createSizeType = async (req, res) => {
    try {
        const { nombre, descripcion, activo } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es requerido',
            });
        }

        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Permitir que admins creen tipos de talle sin cliente_id
        const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

        if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
            return res.status(403).json({
                success: false,
                message: 'No tienes un cliente asignado',
            });
        }

        const tipoTalle = await TipoTalle.crear({
            nombre,
            descripcion,
            activo,
            cliente_id: clienteIdFinal,
        });

        res.status(201).json({
            success: true,
            message: 'Tipo de talle creado exitosamente',
            data: {
                tipoTalle,
            },
        });
    } catch (error) {
        console.error('Error al crear tipo de talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear tipo de talle',
            error: error.message,
        });
    }
};

export const updateSizeType = async (req, res) => {
    try {
        const { id } = req.params;
        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Verificar que el tipo de talle existe y pertenece al cliente (o es admin)
        const tipoTalleExistente = await TipoTalle.obtenerPorId(id);
        if (!tipoTalleExistente) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de talle no encontrado',
            });
        }

        // Verificar permisos (solo si no es admin)
        if (!rolesUsuario.includes('admin') && tipoTalleExistente.cliente_id !== clienteId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar este tipo de talle',
            });
        }

        const tipoTalle = await TipoTalle.actualizar(id, req.body);

        if (!tipoTalle) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de talle no encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Tipo de talle actualizado exitosamente',
            data: {
                tipoTalle,
            },
        });
    } catch (error) {
        console.error('Error al actualizar tipo de talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar tipo de talle',
            error: error.message,
        });
    }
};

export const deleteSizeType = async (req, res) => {
    try {
        const { id } = req.params;
        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Verificar que el tipo de talle existe y pertenece al cliente (o es admin)
        const tipoTalleExistente = await TipoTalle.obtenerPorId(id);
        if (!tipoTalleExistente) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de talle no encontrado',
            });
        }

        // Verificar permisos (solo si no es admin)
        if (!rolesUsuario.includes('admin') && tipoTalleExistente.cliente_id !== clienteId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este tipo de talle',
            });
        }

        const tipoTalle = await TipoTalle.eliminar(id);

        if (!tipoTalle) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de talle no encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Tipo de talle eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar tipo de talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar tipo de talle',
            error: error.message,
        });
    }
};
