-- 1. LIMPIEZA DE TABLAS Y TIPOS PREVIOS (Para evitar conflictos al ejecutar de nuevo)
DROP TABLE IF EXISTS public.productos CASCADE;
DROP TABLE IF EXISTS public.pagos CASCADE;
DROP TABLE IF EXISTS public.suscripciones CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.categorias CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;

-- 2. EXTENSIONES Y TIPOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creamos tipos ENUM para mantener consistencia
CREATE TYPE user_role AS ENUM ('admin', 'cliente', 'staff');
CREATE TYPE subscription_plan AS ENUM ('Bronze Decanter', 'Silver Collector', 'VIP Gold Perfumer');
CREATE TYPE payment_status AS ENUM ('Paid', 'Pending', 'Failed', 'Refunded');
CREATE TYPE payment_method AS ENUM ('Card', 'Transfer', 'Cash', 'Other');

-- 3. TABLA DE CATEGORIAS
CREATE TABLE public.categorias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE USUARIOS (Para el Auth / Dashboard y Perfil de Clientes)
CREATE TABLE public.usuarios (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    empresa VARCHAR(255),
    rol user_role DEFAULT 'cliente',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE SUSCRIPCIONES (Ligada directamente a Usuarios)
CREATE TABLE public.suscripciones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Cancelled')),
    price NUMERIC(10, 2) NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_renewal DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE HISTORIAL DE PAGOS (Para registrar cada pago de las suscripciones)
CREATE TABLE public.pagos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    suscripcion_id UUID REFERENCES public.suscripciones(id) ON DELETE CASCADE,
    monto NUMERIC(10, 2) NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metodo payment_method NOT NULL,
    status payment_status DEFAULT 'Pending',
    comprobante_url TEXT,
    referencia VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE PRODUCTOS (Para el Catálogo Público y Gestión)
CREATE TABLE public.productos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(150) NOT NULL,
    year VARCHAR(4),
    family VARCHAR(150) NOT NULL,
    volume VARCHAR(50),
    code VARCHAR(50) UNIQUE,
    notes TEXT,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('Dama', 'Caballero', 'Unisex', 'Todos')), -- género/público
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL, -- categoría de producto vinculada
    variante VARCHAR(150),
    ocasion VARCHAR(100),
    tipo VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    image TEXT, 
    price NUMERIC(10, 2) DEFAULT 3990.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TRIGGER DE AUTOCREACIÓN DE PERFIL DE USUARIO
-- Crea automáticamente una fila en public.usuarios al registrar un usuario en auth.users de Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, nombre, email, rol, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'cliente',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

