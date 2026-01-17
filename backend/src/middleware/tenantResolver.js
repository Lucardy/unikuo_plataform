import Cliente from '../models/Cliente.js';
import asyncHandler from '../utils/asyncHandler.js';

export const tenantResolver = asyncHandler(async (req, res, next) => {
    // 1. Obtener el hostname (ej: "tienda.unikuo.com" o "mitienda.com")
    const hostname = req.hostname;

    // 2. Determinar el slug o dominio
    // Si estamos en desarrollo (localhost), simulamos un tenant o permitimos paso directo
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Para desarrollo, podemos pasar un header 'x-tenant-slug' para simular
        const slugHeader = req.headers['x-tenant-slug'];
        if (slugHeader) {
            const cliente = await Cliente.obtenerPorSlug(slugHeader);
            if (cliente) {
                req.tenant = cliente;
                return next();
            }
        }
        // Si no hay header en localhost, continuamos sin tenant (o asignamos uno default si existe)
        // Ojo: Algunas rutas requieren tenant, otras no (como /api/admin/login)
        return next();
    }

    // 3. Buscar por dominio personalizado
    let cliente = await Cliente.obtenerPorDominio(hostname);

    // 4. Si no encuentra por dominio, intentar ver si es un subdominio de nuestra app main
    // Asumimos que APP_DOMAIN es ej: unikuo.com
    const appDomain = process.env.APP_DOMAIN || 'unikuo.com';
    if (!cliente && hostname.endsWith(`.${appDomain}`)) {
        const slug = hostname.replace(`.${appDomain}`, '');
        cliente = await Cliente.obtenerPorSlug(slug);
    }

    // 5. Inyectar cliente en request
    if (cliente) {
        req.tenant = cliente;
        // También inyectamos cliente_id para compatibilidad con controladores existentes
        req.cliente_id = cliente.id;
    }

    next();
});
