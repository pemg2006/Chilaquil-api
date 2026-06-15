-- 1. Tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre_usuario TEXT UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    direccion TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla productos (menú fijo)
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    imagen TEXT NOT NULL,
    salsa TEXT CHECK (salsa IN ('roja', 'verde')),
    disponible BOOLEAN DEFAULT TRUE
);

-- 3. Tabla proteinas (catálogo)
CREATE TABLE proteinas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL
);

-- 4. Tabla extras (catálogo)
CREATE TABLE extras (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL
);

-- 5. Tabla pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 1),
    direccion_entrega TEXT NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    estado TEXT DEFAULT 'recibido',
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla pedido_proteinas (relación M:N)
CREATE TABLE pedido_proteinas (
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    proteina_id INTEGER REFERENCES proteinas(id) ON DELETE RESTRICT,
    PRIMARY KEY (pedido_id, proteina_id)
);

-- 7. Tabla pedido_extras (relación M:N)
CREATE TABLE pedido_extras (
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    extra_id INTEGER REFERENCES extras(id) ON DELETE RESTRICT,
    PRIMARY KEY (pedido_id, extra_id)
);