/**
 * Middleware para manejar excepciones asíncronas automáticamente
 * Elimina la necesidad de bloques try-catch repetitivos en los controladores
 * @param {Function} fn - Función del controlador asíncrona
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
