/**
 * Middleware para validar campos requeridos en el cuerpo de la solicitud
 * @param {Array<string>} fields - Lista de campos requeridos
 */
export const validateRequiredFields = (fields) => (req, res, next) => {
    const missingFields = fields.filter(field => {
        const value = req.body[field];
        return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Faltan campos requeridos: ${missingFields.join(', ')}`,
            missing_fields: missingFields
        });
    }

    next();
};

/**
 * Middleware genérico para validación personalizada
 * @param {Function} validatorFn - Función que recibe (req, res) y retorna true si es válido o false/errors si no.
 * Si retorna un objeto o string, se considera mensaje de error.
 */
export const validateCustom = (validatorFn) => async (req, res, next) => {
    const result = await validatorFn(req);

    if (result === true) {
        return next();
    }

    const message = typeof result === 'string' ? result : 'Validación fallida';
    const errors = typeof result === 'object' ? result : { error: message };

    return res.status(400).json({
        success: false,
        message,
        ...errors
    });
};
