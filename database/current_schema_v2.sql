--
-- PostgreSQL database dump
--

\restrict uY4f8Sh723MUtWfdlDF8rYjBbp04ufXFlqSA39z2fbP3nCsnmRSO5tXhcmviFpy

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: calcular_totales_turno(uuid); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.calcular_totales_turno(turno_uuid uuid) RETURNS TABLE(total_ventas numeric, total_efectivo numeric, total_transferencia numeric, total_tarjeta numeric, cantidad_ventas bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(v.total), 0)::DECIMAL(10, 2) as total_ventas,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'cash' THEN v.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_efectivo,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'transfer' THEN v.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_transferencia,
        COALESCE(SUM(CASE WHEN v.metodo_pago IN ('debit_card', 'credit_card') THEN v.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_tarjeta,
        COUNT(v.id) as cantidad_ventas
    FROM ventas v
    WHERE v.turno_id = turno_uuid AND v.estado = 'completed';
END;
$$;


ALTER FUNCTION public.calcular_totales_turno(turno_uuid uuid) OWNER TO unikuo_user;

--
-- Name: establecer_cliente_movimiento_stock(); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.establecer_cliente_movimiento_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM productos
        WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.establecer_cliente_movimiento_stock() OWNER TO unikuo_user;

--
-- Name: establecer_cliente_producto_imagen(); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.establecer_cliente_producto_imagen() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM productos
        WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.establecer_cliente_producto_imagen() OWNER TO unikuo_user;

--
-- Name: establecer_cliente_venta_item(); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.establecer_cliente_venta_item() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM ventas
        WHERE id = NEW.venta_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.establecer_cliente_venta_item() OWNER TO unikuo_user;

--
-- Name: generar_numero_factura(); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.generar_numero_factura() RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    today DATE := CURRENT_DATE;
    date_str TEXT := TO_CHAR(today, 'YYYYMMDD');
    last_number INTEGER;
    new_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM '[0-9]+$') AS INTEGER)), 0)
    INTO last_number
    FROM ventas
    WHERE numero_factura LIKE 'FACT-' || date_str || '-%';
    
    new_number := 'FACT-' || date_str || '-' || LPAD((last_number + 1)::TEXT, 4, '0');
    
    RETURN new_number;
END;
$_$;


ALTER FUNCTION public.generar_numero_factura() OWNER TO unikuo_user;

--
-- Name: obtener_cliente_id_usuario(uuid); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.obtener_cliente_id_usuario(p_usuario_id uuid) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cliente_id UUID;
BEGIN
    SELECT id INTO v_cliente_id
    FROM clientes
    WHERE propietario_id = p_usuario_id AND active = true
    LIMIT 1;
    
    IF v_cliente_id IS NULL THEN
        SELECT t.id INTO v_cliente_id
        FROM clientes t
        INNER JOIN usuarios u ON t.propietario_id = u.id
        INNER JOIN usuario_roles ur ON u.id = ur.usuario_id
        INNER JOIN roles r ON ur.rol_id = r.id
        WHERE r.nombre = 'store_owner' AND u.id = p_usuario_id AND t.active = true
        LIMIT 1;
    END IF;
    
    RETURN v_cliente_id;
END;
$$;


ALTER FUNCTION public.obtener_cliente_id_usuario(p_usuario_id uuid) OWNER TO unikuo_user;

--
-- Name: registrar_movimiento_stock(); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.registrar_movimiento_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO movimientos_stock (
        producto_id,
        tipo,
        cantidad,
        previous_quantity,
        new_quantity,
        usuario_id
    ) VALUES (
        NEW.producto_id,
        CASE 
            WHEN NEW.cantidad > OLD.cantidad THEN 'entry'
            WHEN NEW.cantidad < OLD.cantidad THEN 'exit'
            ELSE 'adjustment'
        END,
        ABS(NEW.cantidad - OLD.cantidad),
        OLD.cantidad,
        NEW.cantidad,
        current_setting('app.usuario_id', true)::UUID
    );
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.registrar_movimiento_stock() OWNER TO unikuo_user;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: unikuo_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO unikuo_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.banners (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    titulo character varying(150),
    description character varying(255),
    image character varying(255) NOT NULL,
    url character varying(255),
    orden integer DEFAULT 0,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.banners OWNER TO unikuo_user;

--
-- Name: categorias; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.categorias (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(120) NOT NULL,
    description character varying(255),
    parent_id uuid,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.categorias OWNER TO unikuo_user;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.clientes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(200) NOT NULL,
    slug character varying(100) NOT NULL,
    email character varying(255),
    phone character varying(20),
    domain character varying(255),
    activo boolean DEFAULT true,
    propietario_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clientes OWNER TO unikuo_user;

--
-- Name: clientes_finales; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.clientes_finales (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    email character varying(150),
    telefono character varying(20),
    direccion text,
    document character varying(50),
    birth_date date,
    notas text,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clientes_finales OWNER TO unikuo_user;

--
-- Name: colores; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.colores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(80) NOT NULL,
    hex_code character varying(7),
    show_color boolean DEFAULT true,
    orden integer DEFAULT 0,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.colores OWNER TO unikuo_user;

--
-- Name: example_table; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.example_table (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.example_table OWNER TO unikuo_user;

--
-- Name: generos; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.generos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    name character varying(50) NOT NULL,
    description text,
    order_index integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.generos OWNER TO unikuo_user;

--
-- Name: TABLE generos; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON TABLE public.generos IS 'G?neros disponibles para productos (Hombre, Mujer, Ni?o, Ni?a, Unisex, etc.)';


--
-- Name: COLUMN generos.tenant_id; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.generos.tenant_id IS 'ID del tenant propietario (NULL para admins)';


--
-- Name: COLUMN generos.name; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.generos.name IS 'Nombre del g?nero (ej: Hombre, Mujer, Ni?o, Ni?a, Unisex)';


--
-- Name: COLUMN generos.description; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.generos.description IS 'Descripci?n del g?nero';


--
-- Name: COLUMN generos.order_index; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.generos.order_index IS 'Orden de visualizaci?n';


--
-- Name: COLUMN generos.active; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.generos.active IS 'Estado activo/inactivo del g?nero';


--
-- Name: marcas; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.marcas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(100) NOT NULL,
    description text,
    url_logo character varying(255),
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.marcas OWNER TO unikuo_user;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO unikuo_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: unikuo_user
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO unikuo_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: unikuo_user
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: movimientos_stock; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.movimientos_stock (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    tipo character varying(20) NOT NULL,
    cantidad integer NOT NULL,
    previous_quantity integer NOT NULL,
    new_quantity integer NOT NULL,
    razon character varying(255),
    referencia_id character varying(100),
    usuario_id uuid,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid,
    CONSTRAINT stock_movements_movement_type_check CHECK (((tipo)::text = ANY ((ARRAY['entry'::character varying, 'exit'::character varying, 'adjustment'::character varying])::text[])))
);


ALTER TABLE public.movimientos_stock OWNER TO unikuo_user;

--
-- Name: precio_cantidad; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.precio_cantidad (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    cantidad_minima integer NOT NULL,
    max_quantity integer,
    precio numeric(10,2) NOT NULL,
    discount_percentage numeric(5,2),
    activo boolean DEFAULT true,
    order_index integer DEFAULT 0,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.precio_cantidad OWNER TO unikuo_user;

--
-- Name: producto_colores; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.producto_colores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    color_id uuid NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.producto_colores OWNER TO unikuo_user;

--
-- Name: producto_imagenes; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.producto_imagenes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    nombre_archivo character varying(255),
    ruta character varying(255) NOT NULL,
    es_principal boolean DEFAULT false,
    orden integer DEFAULT 0,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.producto_imagenes OWNER TO unikuo_user;

--
-- Name: producto_marcas; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.producto_marcas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    marca_id uuid NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.producto_marcas OWNER TO unikuo_user;

--
-- Name: producto_stock; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.producto_stock (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    cantidad integer DEFAULT 0 NOT NULL,
    stock_minimo integer DEFAULT 0,
    max_stock integer DEFAULT 0,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.producto_stock OWNER TO unikuo_user;

--
-- Name: producto_talles; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.producto_talles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    talle_id uuid NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.producto_talles OWNER TO unikuo_user;

--
-- Name: producto_videos; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.producto_videos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producto_id uuid NOT NULL,
    url character varying(500) NOT NULL,
    video_type character varying(20) DEFAULT 'youtube'::character varying,
    title character varying(200),
    description text,
    is_primary boolean DEFAULT false,
    orden integer DEFAULT 0,
    active boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid,
    CONSTRAINT product_videos_video_type_check CHECK (((video_type)::text = ANY ((ARRAY['youtube'::character varying, 'vimeo'::character varying, 'local'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.producto_videos OWNER TO unikuo_user;

--
-- Name: productos; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.productos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    categoria_id uuid,
    nombre character varying(200) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    precio_oferta numeric(10,2),
    precio_transferencia numeric(10,2),
    codigo character varying(50),
    estado character varying(20) DEFAULT 'active'::character varying,
    destacado boolean DEFAULT false,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid,
    CONSTRAINT products_status_check CHECK (((estado)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.productos OWNER TO unikuo_user;

--
-- Name: registros_auditoria; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.registros_auditoria (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cliente_id uuid,
    user_id uuid,
    action character varying(50) NOT NULL,
    table_name character varying(100),
    record_id uuid,
    valores_antiguos jsonb,
    valores_nuevos jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registros_auditoria OWNER TO unikuo_user;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO unikuo_user;

--
-- Name: talles; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.talles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tipo_talle_id uuid NOT NULL,
    nombre character varying(50) NOT NULL,
    orden integer DEFAULT 0,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.talles OWNER TO unikuo_user;

--
-- Name: test_connection; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.test_connection (
    id integer NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.test_connection OWNER TO unikuo_user;

--
-- Name: test_connection_id_seq; Type: SEQUENCE; Schema: public; Owner: unikuo_user
--

CREATE SEQUENCE public.test_connection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_connection_id_seq OWNER TO unikuo_user;

--
-- Name: test_connection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: unikuo_user
--

ALTER SEQUENCE public.test_connection_id_seq OWNED BY public.test_connection.id;


--
-- Name: tipos_medida; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.tipos_medida (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    name character varying(50) NOT NULL,
    description text,
    unit character varying(20),
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tipos_medida OWNER TO unikuo_user;

--
-- Name: TABLE tipos_medida; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON TABLE public.tipos_medida IS 'Tipos de medida para productos (Longitud, Peso, Volumen, etc.)';


--
-- Name: COLUMN tipos_medida.tenant_id; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.tipos_medida.tenant_id IS 'ID del tenant propietario (NULL para admins)';


--
-- Name: COLUMN tipos_medida.name; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.tipos_medida.name IS 'Nombre del tipo de medida (ej: Longitud, Peso, Volumen)';


--
-- Name: COLUMN tipos_medida.description; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.tipos_medida.description IS 'Descripci?n del tipo de medida';


--
-- Name: COLUMN tipos_medida.unit; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.tipos_medida.unit IS 'Unidad de medida (ej: cm, kg, litros)';


--
-- Name: COLUMN tipos_medida.active; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.tipos_medida.active IS 'Estado activo/inactivo del tipo de medida';


--
-- Name: tipos_talle; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.tipos_talle (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    active boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.tipos_talle OWNER TO unikuo_user;

--
-- Name: turnos_caja; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.turnos_caja (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    fecha_apertura timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre timestamp without time zone,
    monto_inicial numeric(10,2) DEFAULT 0.00 NOT NULL,
    efectivo_esperado numeric(10,2),
    efectivo_real numeric(10,2),
    diferencia numeric(10,2),
    total_ventas numeric(10,2),
    total_efectivo numeric(10,2),
    total_transferencia numeric(10,2),
    total_tarjeta numeric(10,2),
    cantidad_ventas integer DEFAULT 0,
    estado character varying(20) DEFAULT 'open'::character varying,
    notas text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cash_register_shifts_status_check CHECK (((estado)::text = ANY ((ARRAY['open'::character varying, 'closed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.turnos_caja OWNER TO unikuo_user;

--
-- Name: usuario_roles; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.usuario_roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuario_roles OWNER TO unikuo_user;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    contrasena character varying(255) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    activo boolean DEFAULT true,
    email_verificado boolean DEFAULT false,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.usuarios OWNER TO unikuo_user;

--
-- Name: COLUMN usuarios.cliente_id; Type: COMMENT; Schema: public; Owner: unikuo_user
--

COMMENT ON COLUMN public.usuarios.cliente_id IS 'ID del tenant al que pertenece el usuario (multi-tenancy)';


--
-- Name: venta_items; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.venta_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    venta_id uuid NOT NULL,
    producto_id uuid NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    precio_unitario numeric(10,2) DEFAULT 0.00 NOT NULL,
    subtotal numeric(10,2) DEFAULT 0.00 NOT NULL,
    descuento numeric(10,2) DEFAULT 0.00,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid
);


ALTER TABLE public.venta_items OWNER TO unikuo_user;

--
-- Name: ventas; Type: TABLE; Schema: public; Owner: unikuo_user
--

CREATE TABLE public.ventas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    numero_factura character varying(50) NOT NULL,
    total numeric(10,2) DEFAULT 0.00 NOT NULL,
    subtotal numeric(10,2) DEFAULT 0.00,
    total_descuento numeric(10,2) DEFAULT 0.00,
    fecha_venta timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id uuid NOT NULL,
    cliente_final_id uuid,
    nombre_cliente character varying(255),
    documento_cliente character varying(50),
    metodo_pago character varying(20) DEFAULT 'cash'::character varying,
    codigo_descuento character varying(50),
    estado character varying(20) DEFAULT 'completed'::character varying,
    notas text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id uuid,
    turno_id uuid,
    CONSTRAINT sales_payment_method_check CHECK (((metodo_pago)::text = ANY ((ARRAY['cash'::character varying, 'transfer'::character varying, 'debit_card'::character varying, 'credit_card'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT sales_status_check CHECK (((estado)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.ventas OWNER TO unikuo_user;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: test_connection id; Type: DEFAULT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.test_connection ALTER COLUMN id SET DEFAULT nextval('public.test_connection_id_seq'::regclass);


--
-- Name: registros_auditoria audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.registros_auditoria
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: marcas brands_name_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT brands_name_key UNIQUE (nombre);


--
-- Name: marcas brands_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: turnos_caja cash_register_shifts_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.turnos_caja
    ADD CONSTRAINT cash_register_shifts_pkey PRIMARY KEY (id);


--
-- Name: categorias categories_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: colores colors_name_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.colores
    ADD CONSTRAINT colors_name_key UNIQUE (nombre);


--
-- Name: colores colors_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.colores
    ADD CONSTRAINT colors_pkey PRIMARY KEY (id);


--
-- Name: clientes_finales customers_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.clientes_finales
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: clientes_finales customers_tenant_id_email_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.clientes_finales
    ADD CONSTRAINT customers_tenant_id_email_key UNIQUE (tenant_id, email);


--
-- Name: example_table example_table_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.example_table
    ADD CONSTRAINT example_table_pkey PRIMARY KEY (id);


--
-- Name: generos genders_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT genders_pkey PRIMARY KEY (id);


--
-- Name: generos genders_tenant_id_name_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT genders_tenant_id_name_key UNIQUE (tenant_id, name);


--
-- Name: tipos_medida measure_types_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.tipos_medida
    ADD CONSTRAINT measure_types_pkey PRIMARY KEY (id);


--
-- Name: tipos_medida measure_types_tenant_id_name_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.tipos_medida
    ADD CONSTRAINT measure_types_tenant_id_name_key UNIQUE (tenant_id, name);


--
-- Name: migrations migrations_filename_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_filename_key UNIQUE (filename);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: precio_cantidad price_quantity_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.precio_cantidad
    ADD CONSTRAINT price_quantity_pkey PRIMARY KEY (id);


--
-- Name: producto_marcas product_brands_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_marcas
    ADD CONSTRAINT product_brands_pkey PRIMARY KEY (id);


--
-- Name: producto_marcas product_brands_product_id_brand_id_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_marcas
    ADD CONSTRAINT product_brands_product_id_brand_id_key UNIQUE (producto_id, marca_id);


--
-- Name: producto_colores product_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_colores
    ADD CONSTRAINT product_colors_pkey PRIMARY KEY (id);


--
-- Name: producto_colores product_colors_product_id_color_id_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_colores
    ADD CONSTRAINT product_colors_product_id_color_id_key UNIQUE (producto_id, color_id);


--
-- Name: producto_imagenes product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_imagenes
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: producto_talles product_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_talles
    ADD CONSTRAINT product_sizes_pkey PRIMARY KEY (id);


--
-- Name: producto_talles product_sizes_product_id_size_id_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_talles
    ADD CONSTRAINT product_sizes_product_id_size_id_key UNIQUE (producto_id, talle_id);


--
-- Name: producto_stock product_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_stock
    ADD CONSTRAINT product_stock_pkey PRIMARY KEY (id);


--
-- Name: producto_stock product_stock_product_id_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_stock
    ADD CONSTRAINT product_stock_product_id_key UNIQUE (producto_id);


--
-- Name: producto_videos product_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_videos
    ADD CONSTRAINT product_videos_pkey PRIMARY KEY (id);


--
-- Name: productos products_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: venta_items sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.venta_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (id);


--
-- Name: ventas sales_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT sales_invoice_number_key UNIQUE (numero_factura);


--
-- Name: ventas sales_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: tipos_talle size_types_name_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.tipos_talle
    ADD CONSTRAINT size_types_name_key UNIQUE (name);


--
-- Name: tipos_talle size_types_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.tipos_talle
    ADD CONSTRAINT size_types_pkey PRIMARY KEY (id);


--
-- Name: talles sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.talles
    ADD CONSTRAINT sizes_pkey PRIMARY KEY (id);


--
-- Name: talles sizes_size_type_id_name_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.talles
    ADD CONSTRAINT sizes_size_type_id_name_key UNIQUE (tipo_talle_id, nombre);


--
-- Name: movimientos_stock stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.movimientos_stock
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: clientes tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: clientes tenants_slug_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT tenants_slug_key UNIQUE (slug);


--
-- Name: test_connection test_connection_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.test_connection
    ADD CONSTRAINT test_connection_pkey PRIMARY KEY (id);


--
-- Name: usuario_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: usuario_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: usuarios users_email_key; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: usuarios users_pkey; Type: CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_audit_logs_action ON public.registros_auditoria USING btree (action);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_audit_logs_created_at ON public.registros_auditoria USING btree (created_at);


--
-- Name: idx_audit_logs_record; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_audit_logs_record ON public.registros_auditoria USING btree (table_name, record_id);


--
-- Name: idx_audit_logs_table_name; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_audit_logs_table_name ON public.registros_auditoria USING btree (table_name);


--
-- Name: idx_audit_logs_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_audit_logs_tenant_id ON public.registros_auditoria USING btree (cliente_id);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_audit_logs_user_id ON public.registros_auditoria USING btree (user_id);


--
-- Name: idx_banners_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_banners_active ON public.banners USING btree (activo);


--
-- Name: idx_banners_order; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_banners_order ON public.banners USING btree (orden);


--
-- Name: idx_banners_tenant_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_banners_tenant_active ON public.banners USING btree (tenant_id, activo);


--
-- Name: idx_banners_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_banners_tenant_id ON public.banners USING btree (tenant_id);


--
-- Name: idx_brands_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_brands_active ON public.marcas USING btree (activo);


--
-- Name: idx_brands_name; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_brands_name ON public.marcas USING btree (nombre);


--
-- Name: idx_brands_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_brands_tenant_id ON public.marcas USING btree (cliente_id);


--
-- Name: idx_cash_shifts_opening_date; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_cash_shifts_opening_date ON public.turnos_caja USING btree (fecha_apertura);


--
-- Name: idx_cash_shifts_status; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_cash_shifts_status ON public.turnos_caja USING btree (estado);


--
-- Name: idx_cash_shifts_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_cash_shifts_tenant_id ON public.turnos_caja USING btree (cliente_id);


--
-- Name: idx_cash_shifts_user_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_cash_shifts_user_id ON public.turnos_caja USING btree (usuario_id);


--
-- Name: idx_categories_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_categories_active ON public.categorias USING btree (activo);


--
-- Name: idx_categories_name; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_categories_name ON public.categorias USING btree (nombre);


--
-- Name: idx_categories_parent_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_categories_parent_id ON public.categorias USING btree (parent_id);


--
-- Name: idx_categories_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_categories_tenant_id ON public.categorias USING btree (cliente_id);


--
-- Name: idx_colors_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_colors_active ON public.colores USING btree (activo);


--
-- Name: idx_colors_order; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_colors_order ON public.colores USING btree (orden);


--
-- Name: idx_colors_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_colors_tenant_id ON public.colores USING btree (cliente_id);


--
-- Name: idx_customers_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_customers_active ON public.clientes_finales USING btree (activo);


--
-- Name: idx_customers_document; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_customers_document ON public.clientes_finales USING btree (document);


--
-- Name: idx_customers_email; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_customers_email ON public.clientes_finales USING btree (email);


--
-- Name: idx_customers_name; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_customers_name ON public.clientes_finales USING btree (nombre, apellido);


--
-- Name: idx_customers_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_customers_tenant_id ON public.clientes_finales USING btree (tenant_id);


--
-- Name: idx_genders_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_genders_active ON public.generos USING btree (active);


--
-- Name: idx_genders_order; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_genders_order ON public.generos USING btree (order_index);


--
-- Name: idx_genders_tenant_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_genders_tenant_active ON public.generos USING btree (tenant_id, active);


--
-- Name: idx_genders_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_genders_tenant_id ON public.generos USING btree (tenant_id);


--
-- Name: idx_measure_types_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_measure_types_active ON public.tipos_medida USING btree (active);


--
-- Name: idx_measure_types_tenant_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_measure_types_tenant_active ON public.tipos_medida USING btree (tenant_id, active);


--
-- Name: idx_measure_types_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_measure_types_tenant_id ON public.tipos_medida USING btree (tenant_id);


--
-- Name: idx_price_quantity_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_price_quantity_active ON public.precio_cantidad USING btree (activo);


--
-- Name: idx_price_quantity_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_price_quantity_product_id ON public.precio_cantidad USING btree (producto_id);


--
-- Name: idx_price_quantity_range; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_price_quantity_range ON public.precio_cantidad USING btree (cantidad_minima, max_quantity);


--
-- Name: idx_price_quantity_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_price_quantity_tenant_id ON public.precio_cantidad USING btree (cliente_id);


--
-- Name: idx_product_brands_brand_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_brands_brand_id ON public.producto_marcas USING btree (marca_id);


--
-- Name: idx_product_brands_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_brands_product_id ON public.producto_marcas USING btree (producto_id);


--
-- Name: idx_product_colors_color_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_colors_color_id ON public.producto_colores USING btree (color_id);


--
-- Name: idx_product_colors_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_colors_product_id ON public.producto_colores USING btree (producto_id);


--
-- Name: idx_product_images_order; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_images_order ON public.producto_imagenes USING btree (orden);


--
-- Name: idx_product_images_primary; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_images_primary ON public.producto_imagenes USING btree (es_principal);


--
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_images_product_id ON public.producto_imagenes USING btree (producto_id);


--
-- Name: idx_product_images_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_images_tenant_id ON public.producto_imagenes USING btree (cliente_id);


--
-- Name: idx_product_sizes_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_sizes_product_id ON public.producto_talles USING btree (producto_id);


--
-- Name: idx_product_sizes_size_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_sizes_size_id ON public.producto_talles USING btree (talle_id);


--
-- Name: idx_product_stock_low_stock; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_stock_low_stock ON public.producto_stock USING btree (cantidad, stock_minimo);


--
-- Name: idx_product_stock_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_stock_product_id ON public.producto_stock USING btree (producto_id);


--
-- Name: idx_product_stock_quantity; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_stock_quantity ON public.producto_stock USING btree (cantidad);


--
-- Name: idx_product_stock_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_stock_tenant_id ON public.producto_stock USING btree (cliente_id);


--
-- Name: idx_product_videos_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_videos_active ON public.producto_videos USING btree (active);


--
-- Name: idx_product_videos_order; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_videos_order ON public.producto_videos USING btree (orden);


--
-- Name: idx_product_videos_primary; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_videos_primary ON public.producto_videos USING btree (is_primary);


--
-- Name: idx_product_videos_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_videos_product_id ON public.producto_videos USING btree (producto_id);


--
-- Name: idx_product_videos_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_product_videos_tenant_id ON public.producto_videos USING btree (cliente_id);


--
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_products_category_id ON public.productos USING btree (categoria_id);


--
-- Name: idx_products_code; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_products_code ON public.productos USING btree (codigo);


--
-- Name: idx_products_featured; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_products_featured ON public.productos USING btree (destacado, estado);


--
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_products_name ON public.productos USING btree (nombre);


--
-- Name: idx_products_status; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_products_status ON public.productos USING btree (estado);


--
-- Name: idx_products_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_products_tenant_id ON public.productos USING btree (cliente_id);


--
-- Name: idx_sale_items_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sale_items_product_id ON public.venta_items USING btree (producto_id);


--
-- Name: idx_sale_items_sale_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sale_items_sale_id ON public.venta_items USING btree (venta_id);


--
-- Name: idx_sale_items_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sale_items_tenant_id ON public.venta_items USING btree (cliente_id);


--
-- Name: idx_sales_client_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sales_client_id ON public.ventas USING btree (cliente_final_id);


--
-- Name: idx_sales_invoice_number; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sales_invoice_number ON public.ventas USING btree (numero_factura);


--
-- Name: idx_sales_sale_date; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sales_sale_date ON public.ventas USING btree (fecha_venta);


--
-- Name: idx_sales_shift_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sales_shift_id ON public.ventas USING btree (turno_id);


--
-- Name: idx_sales_status; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sales_status ON public.ventas USING btree (estado);


--
-- Name: idx_sales_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sales_tenant_id ON public.ventas USING btree (cliente_id);


--
-- Name: idx_sales_user_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sales_user_id ON public.ventas USING btree (usuario_id);


--
-- Name: idx_size_types_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_size_types_active ON public.tipos_talle USING btree (active);


--
-- Name: idx_size_types_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_size_types_tenant_id ON public.tipos_talle USING btree (cliente_id);


--
-- Name: idx_sizes_order; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sizes_order ON public.talles USING btree (orden);


--
-- Name: idx_sizes_size_type_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sizes_size_type_id ON public.talles USING btree (tipo_talle_id);


--
-- Name: idx_sizes_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_sizes_tenant_id ON public.talles USING btree (cliente_id);


--
-- Name: idx_stock_movements_created_at; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_stock_movements_created_at ON public.movimientos_stock USING btree (creado_en);


--
-- Name: idx_stock_movements_product_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_stock_movements_product_id ON public.movimientos_stock USING btree (producto_id);


--
-- Name: idx_stock_movements_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_stock_movements_tenant_id ON public.movimientos_stock USING btree (cliente_id);


--
-- Name: idx_stock_movements_type; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_stock_movements_type ON public.movimientos_stock USING btree (tipo);


--
-- Name: idx_stock_movements_user_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_stock_movements_user_id ON public.movimientos_stock USING btree (usuario_id);


--
-- Name: idx_tenants_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_tenants_active ON public.clientes USING btree (activo);


--
-- Name: idx_tenants_owner_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_tenants_owner_id ON public.clientes USING btree (propietario_id);


--
-- Name: idx_tenants_slug; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_tenants_slug ON public.clientes USING btree (slug);


--
-- Name: idx_user_roles_role_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_user_roles_role_id ON public.usuario_roles USING btree (role_id);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_user_roles_user_id ON public.usuario_roles USING btree (user_id);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_users_active ON public.usuarios USING btree (activo);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_users_email ON public.usuarios USING btree (email);


--
-- Name: idx_users_tenant_id; Type: INDEX; Schema: public; Owner: unikuo_user
--

CREATE INDEX idx_users_tenant_id ON public.usuarios USING btree (cliente_id);


--
-- Name: movimientos_stock trigger_establecer_cliente_movimiento_stock; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER trigger_establecer_cliente_movimiento_stock BEFORE INSERT OR UPDATE ON public.movimientos_stock FOR EACH ROW EXECUTE FUNCTION public.establecer_cliente_movimiento_stock();


--
-- Name: producto_imagenes trigger_establecer_cliente_producto_imagen; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER trigger_establecer_cliente_producto_imagen BEFORE INSERT OR UPDATE ON public.producto_imagenes FOR EACH ROW EXECUTE FUNCTION public.establecer_cliente_producto_imagen();


--
-- Name: venta_items trigger_establecer_cliente_venta_item; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER trigger_establecer_cliente_venta_item BEFORE INSERT OR UPDATE ON public.venta_items FOR EACH ROW EXECUTE FUNCTION public.establecer_cliente_venta_item();


--
-- Name: banners update_banners_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: marcas update_brands_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.marcas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: turnos_caja update_cash_shifts_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_cash_shifts_updated_at BEFORE UPDATE ON public.turnos_caja FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: categorias update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: colores update_colors_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_colors_updated_at BEFORE UPDATE ON public.colores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: clientes_finales update_customers_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.clientes_finales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: example_table update_example_table_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_example_table_updated_at BEFORE UPDATE ON public.example_table FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: generos update_genders_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_genders_updated_at BEFORE UPDATE ON public.generos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tipos_medida update_measure_types_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_measure_types_updated_at BEFORE UPDATE ON public.tipos_medida FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: precio_cantidad update_price_quantity_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_price_quantity_updated_at BEFORE UPDATE ON public.precio_cantidad FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: producto_imagenes update_product_images_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_product_images_updated_at BEFORE UPDATE ON public.producto_imagenes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: producto_stock update_product_stock_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_product_stock_updated_at BEFORE UPDATE ON public.producto_stock FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: producto_videos update_product_videos_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_product_videos_updated_at BEFORE UPDATE ON public.producto_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: productos update_products_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: roles update_roles_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ventas update_sales_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.ventas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tipos_talle update_size_types_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_size_types_updated_at BEFORE UPDATE ON public.tipos_talle FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: talles update_sizes_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_sizes_updated_at BEFORE UPDATE ON public.talles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: clientes update_tenants_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: usuarios update_users_updated_at; Type: TRIGGER; Schema: public; Owner: unikuo_user
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: registros_auditoria audit_logs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.registros_auditoria
    ADD CONSTRAINT audit_logs_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: registros_auditoria audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.registros_auditoria
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: banners banners_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: marcas brands_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT brands_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: turnos_caja cash_register_shifts_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.turnos_caja
    ADD CONSTRAINT cash_register_shifts_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: turnos_caja cash_register_shifts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.turnos_caja
    ADD CONSTRAINT cash_register_shifts_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE;


--
-- Name: categorias categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categorias(id) ON DELETE SET NULL;


--
-- Name: categorias categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categories_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: colores colors_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.colores
    ADD CONSTRAINT colors_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: clientes_finales customers_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.clientes_finales
    ADD CONSTRAINT customers_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: generos genders_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT genders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: tipos_medida measure_types_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.tipos_medida
    ADD CONSTRAINT measure_types_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: precio_cantidad price_quantity_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.precio_cantidad
    ADD CONSTRAINT price_quantity_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: precio_cantidad price_quantity_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.precio_cantidad
    ADD CONSTRAINT price_quantity_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: producto_marcas product_brands_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_marcas
    ADD CONSTRAINT product_brands_brand_id_fkey FOREIGN KEY (marca_id) REFERENCES public.marcas(id) ON DELETE CASCADE;


--
-- Name: producto_marcas product_brands_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_marcas
    ADD CONSTRAINT product_brands_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: producto_colores product_colors_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_colores
    ADD CONSTRAINT product_colors_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colores(id) ON DELETE CASCADE;


--
-- Name: producto_colores product_colors_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_colores
    ADD CONSTRAINT product_colors_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: producto_imagenes product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_imagenes
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: producto_imagenes product_images_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_imagenes
    ADD CONSTRAINT product_images_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: producto_talles product_sizes_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_talles
    ADD CONSTRAINT product_sizes_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: producto_talles product_sizes_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_talles
    ADD CONSTRAINT product_sizes_size_id_fkey FOREIGN KEY (talle_id) REFERENCES public.talles(id) ON DELETE CASCADE;


--
-- Name: producto_stock product_stock_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_stock
    ADD CONSTRAINT product_stock_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: producto_stock product_stock_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_stock
    ADD CONSTRAINT product_stock_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: producto_videos product_videos_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_videos
    ADD CONSTRAINT product_videos_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: producto_videos product_videos_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.producto_videos
    ADD CONSTRAINT product_videos_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: productos products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON UPDATE CASCADE;


--
-- Name: productos products_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT products_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: venta_items sale_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.venta_items
    ADD CONSTRAINT sale_items_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON UPDATE CASCADE;


--
-- Name: venta_items sale_items_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.venta_items
    ADD CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (venta_id) REFERENCES public.ventas(id) ON DELETE CASCADE;


--
-- Name: venta_items sale_items_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.venta_items
    ADD CONSTRAINT sale_items_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: ventas sales_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT sales_client_id_fkey FOREIGN KEY (cliente_final_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: ventas sales_shift_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT sales_shift_id_fkey FOREIGN KEY (turno_id) REFERENCES public.turnos_caja(id) ON DELETE SET NULL;


--
-- Name: ventas sales_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT sales_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: ventas sales_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT sales_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE;


--
-- Name: tipos_talle size_types_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.tipos_talle
    ADD CONSTRAINT size_types_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: talles sizes_size_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.talles
    ADD CONSTRAINT sizes_size_type_id_fkey FOREIGN KEY (tipo_talle_id) REFERENCES public.tipos_talle(id) ON UPDATE CASCADE;


--
-- Name: talles sizes_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.talles
    ADD CONSTRAINT sizes_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: movimientos_stock stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.movimientos_stock
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON UPDATE CASCADE;


--
-- Name: movimientos_stock stock_movements_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.movimientos_stock
    ADD CONSTRAINT stock_movements_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: movimientos_stock stock_movements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.movimientos_stock
    ADD CONSTRAINT stock_movements_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE;


--
-- Name: clientes tenants_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT tenants_owner_id_fkey FOREIGN KEY (propietario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE;


--
-- Name: usuario_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: usuario_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: usuarios users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikuo_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_tenant_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict uY4f8Sh723MUtWfdlDF8rYjBbp04ufXFlqSA39z2fbP3nCsnmRSO5tXhcmviFpy

