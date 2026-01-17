/**
 * Middleware para manejar excepciones asíncronas en rutas de Express.
 * Elimina la necesidad de bloques try/catch repetitivos en cada controlador.
 * 
 * @param {Function} fn - La función del controlador asíncrono.
 * @returns {Function} - Un middleware de Express.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
