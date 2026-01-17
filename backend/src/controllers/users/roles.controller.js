import Rol from '../../models/Rol.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getAllRoles = asyncHandler(async (req, res) => {
    const roles = await Rol.obtenerTodos();

    res.json({
        success: true,
        data: {
            roles,
        },
    });
});
