# Nexus - Documentacion del Proyecto

## 1. Descripcion General
Nexus es una aplicacion web construida con Laravel + Inertia + React para autenticacion y gestion de cuentas con enfoque en seguridad.

El sistema implementa:
- Inicio de sesion con usuario/clave + OTP por correo.
- Recuperacion de contrasena con OTP por correo.
- Registro de eventos de auditoria en base de datos.
- Dashboard con metricas y actividad reciente.
- Modulo de configuracion de perfil, contrasena, apariencia y doble factor (Fortify).

## 2. Stack Tecnologico

### Backend
- PHP `^8.2` en `composer.json`.
- Laravel `^12.0`.
- Laravel Fortify `^1.30` (auth, reset password, email verification, two-factor).
- Inertia Laravel `^2.0`.

### Frontend
- React `^19.2.0` + TypeScript.
- Inertia React `^2.3.7`.
- Vite `^7`.
- Tailwind CSS v4.
- Radix UI + componentes utilitarios propios.
- Wayfinder para rutas tipadas frontend (`resources/js/routes/*`).

### Testing / Calidad
- PHPUnit `^11.5`.
- Laravel Pint.
- ESLint + Prettier.

## 3. Arquitectura del Proyecto
Estructura principal:

- `app/`
- `app/Http/Controllers/Auth/`: controladores de login OTP y recuperacion OTP.
- `app/Http/Controllers/Settings/`: perfil, password y 2FA.
- `app/Actions/Fortify/`: acciones de registro y reseteo de contrasena.
- `app/Mail/OtpCodeMail.php`: envio de OTP por correo.
- `app/Models/User.php`: modelo de usuario con esquema personalizado (`password_hash`).
- `app/Concerns/`: reglas reutilizables de validacion.

- `routes/`
- `routes/web.php`: rutas de home, login OTP, reset OTP y dashboard.
- `routes/settings.php`: rutas de configuracion autenticada.

- `resources/js/`
- `resources/js/pages/`: pantallas Inertia (auth, dashboard, settings).
- `resources/js/components/`: componentes UI y layout.
- `resources/js/routes/`: helpers tipados de rutas (autogenerados por wayfinder).

- `database/migrations/`: esquema de tablas base + tablas OTP + auditoria.
- `tests/Feature/`: pruebas funcionales de auth, dashboard y settings.

## 4. Flujo Funcional

### 4.1 Login con OTP
1. Usuario envia `email` + `password` en `/login`.
2. Se valida contra `users.password_hash`.
3. Si es valido:
- Se genera OTP de 6 digitos.
- Se guarda en `otp_codes` con expiracion (5 minutos) y `used=0`.
- Se envia correo con el OTP.
- Se guarda usuario pendiente en sesion.
4. Usuario verifica OTP en `/otp`.
5. Si OTP correcto y vigente:
- Se marca `used=1`.
- Se autentica sesion.
- Se registra evento en `audit_logs`.

### 4.2 Proteccion anti fuerza bruta
En `OtpLoginController`:
- Maximo `5` intentos fallidos.
- Ventana de `2` minutos.
- Se evalua por IP, por usuario y por email.
- Eventos bloqueados/fallidos quedan auditados.

### 4.3 Recuperacion de contrasena con OTP
1. Usuario solicita OTP en `/forgot-password/otp`.
2. Se genera OTP (5 min) y se envia por correo.
3. Usuario verifica OTP en `/forgot-password/otp/verify`.
4. Si valido, se crea token Fortify y redirige a pantalla de reset.

### 4.4 Dashboard
Ruta: `/dashboard` (middleware `auth` + `verified`).

Entrega a frontend:
- Eventos de `audit_logs`.
- Metricas agregadas:
- Total eventos.
- Logins OTP exitosos.
- Registros de usuarios.
- Eventos fallidos/bloqueados.
- Serie semanal de actividad (logins vs fallidos).
- Listado de usuarios con hash y token remember.

### 4.5 Ajustes de usuario
- Perfil: `GET/PATCH /settings/profile`.
- Eliminar cuenta: `DELETE /settings/profile` (borra tambien OTPs y auditoria del usuario).
- Password: `GET/PUT /settings/password`.
- Apariencia: `GET /settings/appearance`.
- Two-factor: `GET /settings/two-factor`.

## 5. Base de Datos

### 5.1 Tablas principales
- `users`
- `id`
- `email` (unique)
- `password_hash`
- `remember_token`
- `created_at`

- `otp_codes`
- `id`
- `user_id` (FK a `users`)
- `code` (6 chars)
- `expires_at`
- `used`

- `audit_logs`
- `id`
- `user_id` (nullable, FK a `users`)
- `action`
- `ip_address`
- `details` (JSON serializado en texto)
- `created_at`

Adicionalmente existen tablas de framework: `password_reset_tokens`, `sessions`, `cache`, `jobs`.

## 6. Seguridad y Autenticacion
- Fortify habilita:
- Registro.
- Reset password.
- Verificacion de email.
- Two-factor authentication (`confirm=true`, `confirmPassword=true`).
- Password policy endurecida en produccion (`min 12`, mixed-case, numeros, simbolos, uncompromised).
- Middleware `PreventBackHistory` agrega cabeceras anti-cache para evitar volver a paginas sensibles autenticadas.

## 7. Frontend
- SPA server-driven con Inertia.
- Entrypoint: `resources/js/app.tsx`.
- Paginas auth en `resources/js/pages/auth/*`.
- Dashboard en `resources/js/pages/dashboard.tsx`.
- Configuracion en `resources/js/pages/settings/*`.
- Sistema de rutas tipadas con wayfinder (`resources/js/routes/*`) para formularios y navegacion.

## 8. Configuracion de Entorno
Basado en `.env.example`:

Variables criticas:
- App: `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_URL`.
- DB: `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
- Mail (OTP): `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`.
- Queue/Session/Cache segun entorno.

Recomendado para desarrollo local:
- `MAIL_MAILER=log` si no hay SMTP real.
- DB MySQL o SQLite segun preferencia.

## 9. Instalacion y Ejecucion

### 9.1 Requisitos
- PHP 8.4+ (en este entorno `artisan` fallo por PHP 8.3.6).
- Composer.
- Node.js + npm.
- Motor de BD (MySQL/MariaDB/SQLite).
- Extension PHP `zip` disponible (faltante en el entorno actual).

### 9.2 Setup rapido
```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
npm install
```

### 9.3 Desarrollo
Opcion separada:
```bash
php artisan serve
npm run dev
```

Opcion combinada (composer script):
```bash
composer run dev
```

Rutas utiles:
- `http://127.0.0.1:8000/login`
- `http://127.0.0.1:8000/register`

### 9.4 Build produccion
```bash
npm run build
```

## 10. Comandos Disponibles

### Composer scripts
- `composer run setup`: instala dependencias, prepara `.env`, genera key, migra y build frontend.
- `composer run dev`: servidor + cola + logs + vite concurrente.
- `composer run dev:ssr`: build SSR y arranque con SSR server.
- `composer run lint`: Pint.
- `composer run test`: clear config + pint test + php artisan test.

### NPM scripts
- `npm run dev`
- `npm run build`
- `npm run build:ssr`
- `npm run lint`
- `npm run format`
- `npm run types`

## 11. Pruebas
Suites en `phpunit.xml`:
- Unit: `tests/Unit`.
- Feature: `tests/Feature`.

Cobertura funcional existente:
- Auth (login, logout, OTP, registro, reset, verificacion email, 2FA challenge).
- Dashboard.
- Settings (perfil, password, 2FA).

Ejecucion:
```bash
composer run test
```

## 12. Observaciones Tecnicas
1. El proyecto usa esquema de usuario personalizado (`password_hash`) y no la columna Laravel tradicional `password`.
2. Hay una migracion vacia para 2FA (`2025_08_14_170933_add_two_factor_columns_to_users_table.php`), por lo que la persistencia de 2FA requiere revisar/implementar columnas esperadas por Fortify.
3. Varias pruebas heredadas de features de Fortify (email verification/nombre) pueden requerir alinear modelo/migraciones si se busca consistencia total con ese esquema personalizado.
4. En este entorno no se pudo ejecutar `artisan` por version de PHP y extension faltante; documentacion generada a partir del analisis estatico del codigo fuente.

## 13. Archivos Clave para Onboarding
- `routes/web.php`
- `app/Http/Controllers/Auth/OtpLoginController.php`
- `app/Http/Controllers/Auth/OtpPasswordResetController.php`
- `resources/js/pages/dashboard.tsx`
- `app/Providers/FortifyServiceProvider.php`
- `config/fortify.php`
- `database/migrations/0001_01_01_000000_create_users_table.php`
- `database/migrations/2026_02_17_000001_create_otp_codes_table.php`
- `database/migrations/2026_02_17_000002_create_audit_logs_table.php`

## 14. Estado Actual del Repositorio
- Se agrego este archivo de documentacion: `README.md`.
- No se modifico logica de negocio ni configuracion de la aplicacion.
