# ChilaquilApp API

API REST de ChilaquilApp, construida con Node.js (funciones serverless) y
desplegada en Vercel, con base de datos PostgreSQL en Supabase.

> La documentacion completa de cada endpoint es la tarea #23 (README de la
> API). Este README cubre solo la configuracion del proyecto (tarea #5).

## Estructura

```
/api
  /auth        -> registro.js, login.js            (tarea #8 - Mauricio)
  /productos   -> index.js, [id].js                (tarea #9 - Mauricio)
  /catalogo    -> proteinas.js, extras.js           (tarea #10 - Aaron)
  /pedidos     -> index.js, [id].js                 (tarea #11 - Mauricio)
  health.js    -> endpoint de diagnostico (no es parte del contrato)
/lib
  db.js        -> conexion a Supabase/PostgreSQL
  auth.js      -> validacion de credenciales        (tarea #8 - Mauricio)
  respuestas.js -> helper para errores con formato uniforme
/seed
  seed.js      -> carga inicial de productos/proteinas/extras (tarea #7 - Aaron)
```

## Configuracion local

1. `npm install`
2. Copiar `.env.example` a `.env` y poner el `DATABASE_URL` real (lo da
   Supabase en Project Settings > Database > Connection string; usar la
   version "Connection pooling").
3. Correr `npx vercel dev` (o `npm run dev` si `vercel` esta instalado).
4. Probar `GET http://localhost:3000/api/health`. Debe responder algo como
   `{ "ok": true, "hora": "..." }` si la conexion a la base de datos funciona.

## Despliegue en Vercel

1. Importar este repo en vercel.com.
2. En "Settings > Environment Variables" agregar `DATABASE_URL`.
3. Vercel detecta automaticamente los archivos dentro de `/api` como
   funciones serverless; no se necesita configuracion extra para esto.

> Nota: como el proyecto usa rutas dinamicas con corchetes (`[id].js`) y un
> runtime de Node especifico (`engines.node` en package.json), si algo no
> se despliega como se espera conviene revisar la documentacion actual de
> Vercel para "Node.js Runtime" y versiones de Node soportadas, porque
> Vercel las actualiza con cierta frecuencia.

## Convenciones (contrato, ver seccion 5 del plan)

- Todo el JSON usa camelCase.
- Formato unico de error: `{ "error": { "codigo": "...", "mensaje": "..." } }`.
- Codigos HTTP: 200, 201, 400, 401, 404, 500.
- Nunca hardcodear credenciales: todo via variables de entorno (`DATABASE_URL`).
