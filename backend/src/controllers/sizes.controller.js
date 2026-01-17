import Talle from '../models/Talle.js';

export const getAllSizes = async (req, res) => {
    try {
        const { tipo_talle_id } = req.query;
        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Si es admin, puede ver todos los talles (clienteId = null)
        // Si no es admin, solo ve los de su cliente
        const talles = await Talle.obtenerTodos(
            tipo_talle_id || null,
            rolesUsuario.includes('admin') ? null : clienteId
        );

        res.json({
            success: true,
            data: {
                talles,
            },
        });
    } catch (error) {
        console.error('Error al obtener talles:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener talles',
            error: error.message,
        });
    }
};

export const getSizeById = async (req, res) => {
    try {
        const { id } = req.params;
        const talle = await Talle.obtenerPorId(id);

        if (!talle) {
            return res.status(404).json({
                success: false,
                message: 'Talle no encontrado',
            });
        }

        res.json({
            success: true,
            data: {
                talle,
            },
        });
    } catch (error) {
        console.error('Error al obtener talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener talle',
            error: error.message,
        });
    }
};

export const createSize = async (req, res) => {
    try {
        const { tipo_talle_id, nombre, orden } = req.body;

        if (!tipo_talle_id || !nombre) {
            return res.status(400).json({
                success: false,
                message: 'El tipo de talle y el nombre son requeridos',
            });
        }

        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Permitir que admins creen talles sin cliente_id
        const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

        if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
            return res.status(403).json({
                success: false,
                message: 'No tienes un cliente asignado',
            });
        }

        const talle = await Talle.crear({
            tipo_talle_id,
            nombre,
            orden,
            cliente_id: clienteIdFinal,
        });

        res.status(201).json({
            success: true,
            message: 'Talle creado exitosamente',
            data: {
                talle,
            },
        });
    } catch (error) {
        console.error('Error al crear talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear talle',
            error: error.message,
        });
    }
};

export const updateSize = async (req, res) => {
    try {
        const { id } = req.params;
        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Verificar que el talle existe y pertenece al cliente (o es admin)
        const talleExistente = await Talle.obtenerPorId(id);
        if (!talleExistente) {
            return res.status(404).json({
                success: false,
                message: 'Talle no encontrado',
            });
        }

        // Verificar permisos (solo si no es admin)
        if (!rolesUsuario.includes('admin') && talleExistente.cliente_id !== clienteId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar este talle',
            });
        }

        const talle = await Talle.actualizar(id, req.body);

        if (!talle) {
            return res.status(404).json({
                success: false,
                message: 'Talle no encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Talle actualizado exitosamente',
            data: {
                talle,
            },
        });
    } catch (error) {
        console.error('Error al actualizar talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar talle',
            error: error.message,
        });
    }
};

export const deleteSize = async (req, res) => {
    try {
        const { id } = req.params;
        const clienteId = req.usuario?.cliente_id || null;
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

        // Verificar que el talle existe y pertenece al cliente (o es admin)
        const talleExistente = await Talle.obtenerPorId(id);
        if (!talleExistente) {
            return res.status(404).json({
                success: false,
                message: 'Talle no encontrado',
            });
        }

        // Verificar permisos (solo si no es admin)
        if (!rolesUsuario.includes('admin') && talleExistente.cliente_id !== clienteId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este talle',
            });
        }

        const talle = await Talle.eliminar(id);

        if (!talle) {
            return res.status(404).json({
                success: false,
                message: 'Talle no encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Talle eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar talle:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar talle',
            error: error.message,
        });
    }
};
