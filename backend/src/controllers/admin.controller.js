import Cliente from '../models/Cliente.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Obtener todos los clientes (Solo Super Admin)
 */
export const obtenerClientes = asyncHandler(async (req, res) => {
    // Pasar true para incluir inactivos
    const clientes = await Cliente.obtenerTodos(true);
    res.json(clientes);
});

/**
 * Obtener detalle de un cliente (Solo Super Admin)
 */
export const obtenerClientePorId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.obtenerPorId(id);

    if (!cliente) {
        res.status(404);
        throw new Error('Cliente no encontrado');
    }

    res.json(cliente);
});

/**
 * Actualizar configuración de un cliente (Módulos, Tema, Layout)
 */
export const actualizarConfigCliente = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { componentes_config, theme_config, layout_config, activo } = req.body;

    const clienteExistente = await Cliente.obtenerPorId(id);
    if (!clienteExistente) {
        res.status(404);
        throw new Error('Cliente no encontrado');
    }

    // Preparar objeto de actualización solo con lo que se envió
    const datosActualizar = {};

    // Fusionar configs existentes con las nuevas si se envían parciales, o reemplazar todo
    // Aquí optamos por reemplazar el objeto completo si se envía, para dar control total al front
    if (componentes_config !== undefined) datosActualizar.componentes_config = componentes_config;
    if (theme_config !== undefined) datosActualizar.theme_config = theme_config;
    if (layout_config !== undefined) datosActualizar.layout_config = layout_config;
    if (activo !== undefined) datosActualizar.activo = activo;

    const clienteActualizado = await Cliente.actualizar(id, datosActualizar);

    res.json(clienteActualizado);
});
