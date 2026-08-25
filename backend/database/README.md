# Base de datos SMM

La migracion inicial para SQL Server esta en `migrations/001_initial_smm.sql`.

## Ejecucion con SQL Server Management Studio

1. Abre el archivo en SQL Server Management Studio o Azure Data Studio.
2. Conectate a la instancia de SQL Server.
3. Ejecuta el script completo.
4. Comprueba que se haya creado la base `SmmDb`.

## Ejecucion con `sqlcmd`

```powershell
sqlcmd -S localhost\SQLEXPRESS -E -i .\backend\database\migrations\001_initial_smm.sql
```

Para autenticacion SQL Server:

```powershell
sqlcmd -S localhost\SQLEXPRESS -U <usuario> -P <password> -i .\backend\database\migrations\001_initial_smm.sql
```

El script crea tablas, indices y datos demo. Es idempotente para las tablas, indices y semillas principales, por lo que puede repetirse en desarrollo.

## Tablas

- `Users`: perfiles y credenciales almacenadas como hashes.
- `Services`: catalogo de servicios SMM.
- `Orders`: ordenes solicitadas por los usuarios.
- `BalanceTransactions`: creditos, debitos y reembolsos.
- `Payments`: pagos externos y su estado.
- `OrderStatusHistory`: trazabilidad de cambios de orden.
- `AuditLogs`: auditoria tecnica y de negocio.

La API aun utiliza repositorios en memoria. La siguiente fase sustituira esos repositorios por un adaptador SQL Server, despues de confirmar la instancia y las credenciales locales.

## Configuracion del backend

Copia `backend/.env.example` a `backend/.env` y configura las credenciales de tu instancia. El backend carga la conexion de forma diferida mediante `src/config/database.js`; instalar `mssql` no activa una conexion hasta que un repositorio la solicite.

Por seguridad, no guardes `DB_PASSWORD` en Git. En produccion usa variables de entorno del sistema o un gestor de secretos.

## API y seguridad

La API preferida usa el prefijo `/api/v1`. Se conservan aliases `/api/auth` y `/api/smm/*` durante la migracion.

- `POST /api/v1/auth/register`: crea una cuenta.
- `POST /api/v1/auth/login`: devuelve un JWT.
- `/api/v1/smm/services`: catalogo publico.
- Ordenes, saldo y perfil requieren `Authorization: Bearer <token>`.

En produccion cambia `JWT_SECRET` por un secreto aleatorio largo. El frontend debe guardar el token de forma segura y enviarlo mediante un interceptor HTTP.

El backend rechaza el arranque en produccion si `JWT_SECRET` no tiene al menos 32 caracteres. Cada request registra metodo, ruta, estado, duracion y `requestId` sin incluir contrasenas ni tokens.
