# Roadmap: Plataforma Multi-tenant Unikuo

Este documento detalla la hoja de ruta para evolucionar el proyecto actual hacia una plataforma SaaS Multi-tenant completa, donde múltiples clientes pueden tener sus propios sitios web personalizados gestionados desde una única instancia.

## Fase 1: Arquitectura Multi-tenant (Backend Core)
*El objetivo es asegurar que el backend sepa "quién es quién" basándose en el dominio.*

- [ ] **Auditoría de Base de Datos**: Confirmar que *todas* las tablas de recursos (productos, ventas, configuraciones) tengan una columna `cliente_id` (Tenant ID).
- [ ] **Modelo de Configuración de Tenant**: Crear/Actualizar el modelo `Cliente` (o crear una tabla `configuraciones_sitio`) para almacenar:
    -   `dominio_personalizado` (ej: tienda.com)
    -   `subdominio_app` (ej: tienda.unikuo.com)
    -   `theme_config` (JSON): Colores, fuentes, bordes.
    -   `layout_config` (JSON): Orden y tipo de componentes de la home.
- [ ] **Middleware Resolver de Tenant**:
    -   Crear `tenantResolver.js`.
    -   Lógica: Leer el header `Host`, buscar en DB qué `cliente_id` corresponde, e inyectarlo en `req.tenant`.
- [ ] **Segregación de Datos**:
    -   Asegurar que *todas* las queries filtren automáticamente por `req.tenant.id` (evitar fugas de datos entre clientes).

## Fase 2: Motor de Frontend Dinámico (The "Engine")
*El frontend debe ser un camaleón que cambia según quién lo visita.*

- [ ] **Contexto Global de Tenant**:
    -   Al iniciar la app, hacer fetch de la configuración basándose en `window.location.hostname`.
    -   Guardar colores, logos y textos en un React Context.
- [ ] **Sistema de Temas (Theming)**:
    -   Implementar un sistema (ej: CSS Variables o ThemeProvider de Styled Components/Tailwind) que inyecte los valores del Tenant en el CSS root.
    -   *Ejemplo*: `--primary-color: {config.colors.primary}`.
- [ ] **Renderizado Dinámico de Páginas**:
    -   Crear un "Component Map" que asocie nombres de string a componentes reales.
        -   `"HeroSection" -> <Hero />`
        -   `"FeaturedProducts" -> <ProductGrid />`
    -   La "Home" iterará sobre `layout_config` del DB y renderizará los componentes en orden.

## Fase 3: Componentes "Agnósticos" (Building Blocks)
*Piezas de Lego que pueden vestirse diferente pero funcionan igual.*

- [ ] **Desarrollo de Librería de Componentes**:
    -   Navbar / Footer (configurables).
    -   Banners / Sliders.
    -   Grillas de Productos.
    -   Formularios de Contacto.
- [ ] **Standard de Props**: Definir qué configuraciones acepta cada componente (títulos, imágenes de fondo, alineación).

## Fase 4: Panel de Administración (Super Admin y Tenant Admin)
*La interfaz para que tú y tus clientes gestionen sus sitios.*

- [ ] **Editor Visual (Básico)**:
    -   Interfaz para seleccionar colores primarios/secundarios.
    -   Subida de Logo y Favicon.
- [ ] **Gestor de Dominios**:
    -   CRUD para vincular dominios a un cliente.
- [ ] **Constructor de Home (Drag & Drop simplificado)**:
    -   Lista de componentes disponibles -> Añadir a la lista de "Mi Home".

## Fase 5: Infraestructura y SEO
- [ ] **Manejo de SSL**: Automatizar certificados para dominios de clientes (ej: usando Caddy, Traefik o servicios como Cloudflare).
- [ ] **SEO Dinámico**: Inyectar etiquetas `<meta>` (título, descripción) dinámicamente desde la DB según el tenant.

---
## Próximos Pasos Inmediatos (Acciones sugeridas)

1.  **Revisar Middleware**: Crear el `tenantResolver` en el backend para identificar peticiones por dominio.
2.  **Configuración DB**: Crear la tabla/columna para guardar la "Configuración Visual" (JSON) de cada cliente.
3.  **Frontend**: Crear un hook `useTenant` para probar la carga dinámica de configuración.
