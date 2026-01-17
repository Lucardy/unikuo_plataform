import Usuario from '../../models/Usuario.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const changeUserPassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'La contraseña debe tener al menos 6 caracteres',
        });
    }

    const usuarioExistente = await Usuario.buscarPorId(id);
    if (!usuarioExistente) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
        });
    }

    await Usuario.cambiarContrasena(id, password);

    res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente',
    });
});

export const activateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.activar(id);

    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Usuario activado exitosamente',
    });
});

export const deactivateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.desactivar(id);

    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Usuario desactivado exitosamente',
    });
});
