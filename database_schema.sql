-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.usuarios (
  id uuid NOT NULL,
  nombre character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  telefono character varying,
  empresa character varying,
  rol USER-DEFINED DEFAULT 'cliente'::user_role,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  empresa_id uuid,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT usuarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id)
);
CREATE TABLE public.suscripciones (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  usuario_id uuid,
  plan USER-DEFINED NOT NULL,
  status character varying DEFAULT 'Active'::character varying CHECK (status::text = ANY (ARRAY['Active'::character varying, 'Paused'::character varying, 'Cancelled'::character varying]::text[])),
  price numeric NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  next_renewal date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  empresa_id uuid,
  CONSTRAINT suscripciones_pkey PRIMARY KEY (id),
  CONSTRAINT suscripciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT suscripciones_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id)
);
CREATE TABLE public.pagos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  suscripcion_id uuid,
  monto numeric NOT NULL,
  fecha_pago timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  metodo USER-DEFINED NOT NULL,
  status USER-DEFINED DEFAULT 'Pending'::payment_status,
  comprobante_url text,
  referencia character varying,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  empresa_id uuid,
  CONSTRAINT pagos_pkey PRIMARY KEY (id),
  CONSTRAINT pagos_suscripcion_id_fkey FOREIGN KEY (suscripcion_id) REFERENCES public.suscripciones(id),
  CONSTRAINT pagos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id)
);
CREATE TABLE public.productos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  brand character varying NOT NULL,
  year character varying,
  family character varying NOT NULL,
  volume character varying,
  code character varying UNIQUE,
  notes text,
  categoria character varying NOT NULL CHECK (categoria::text = ANY (ARRAY['Dama'::character varying, 'Caballero'::character varying, 'Unisex'::character varying, 'Todos'::character varying]::text[])),
  image text,
  price numeric DEFAULT 3990.00,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  categoria_id uuid,
  empresa_id uuid,
  CONSTRAINT productos_pkey PRIMARY KEY (id),
  CONSTRAINT productos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id),
  CONSTRAINT productos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id)
);
CREATE TABLE public.categorias (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre character varying NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  empresa_id uuid,
  CONSTRAINT categorias_pkey PRIMARY KEY (id),
  CONSTRAINT categorias_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id)
);
CREATE TABLE public.empresas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre character varying NOT NULL,
  logo_url text,
  configuracion jsonb DEFAULT '{}'::jsonb,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT empresas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.planes_config (
  plan USER-DEFINED NOT NULL,
  nombre_legible character varying NOT NULL,
  precio_sugerido numeric NOT NULL,
  limite_suscripciones integer NOT NULL DEFAULT 10 CHECK (limite_suscripciones >= 0),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT planes_config_pkey PRIMARY KEY (plan)
);