# Arquitectura objetivo

## Decision

El sistema se organizara como un monolito modular con dos superficies claramente separadas:

- `frontend`: SPA Angular standalone.
- `backend`: API Node.js/Express.

No se adoptaran microservicios mientras el producto no tenga necesidades reales de despliegue independiente, escalado separado o equipos distintos.

## Frontend Angular

```text
frontend/src/app/
  core/                    Servicios singleton, configuracion, interceptores y modelos globales
  layout/                  Layouts y shell visual reutilizable
  shared/                  Directivas, servicios y componentes reutilizables
  features/
    climatech/             Producto publico HVAC y electrico
      pages/               Pantallas lazy-loaded
      data-access/         Fachadas y acceso a API del producto
      models/              Tipos del dominio frontend
    smm/                   Panel SMM heredado o producto separado
      data-access/
      models/
    smm-layout/            Shell y rutas del panel SMM
```

Reglas:

1. Una feature no importa internals de otra feature.
2. `core` no contiene logica propia de una pantalla.
3. Las paginas coordinan UI; los calculos y efectos se mueven a servicios o casos de uso.
4. Las rutas de cada producto permanecen en su feature y usan lazy loading.
5. Los contratos HTTP se representan con tipos y mappers, no con objetos anonimos repartidos.

Patrones aplicables:

- Facade para booking, quote-tool y diagnostico.
- Strategy para calculo BTU, urgencia y tipos de servicio.
- Adapter para WhatsApp y futuros proveedores externos.
- Presentational/container cuando una pantalla acumule demasiada plantilla y estado.

## Backend Express

```text
backend/src/
  config/                  Configuracion y variables de entorno
  middleware/              CORS, request id, validacion y errores
  modules/
    orders/
      orders.routes.js
      orders.controller.js
      orders.service.js
      orders.repository.js
      orders.schemas.js
    services/
    booking/               Primer modulo Climatech a incorporar
    quotes/                Segundo modulo Climatech a incorporar
  shared/                  Errores, respuestas y utilidades sin dominio
  app.js                   Composicion de Express (objetivo)
  index.js                 Arranque del proceso
```

## Persistencia SQL Server

La persistencia objetivo es SQL Server en la base `SmmDb`. La migracion inicial vive en `backend/database/migrations/001_initial_smm.sql`.

El backend se conectara mediante un adaptador de infraestructura y los casos de uso dependeran de interfaces de repositorio. Los modulos no conoceran detalles de `mssql`, conexiones, transacciones ni nombres fisicos de tablas.

Tablas iniciales:

- `Users`, `Services` y `Orders` para el flujo principal del panel.
- `BalanceTransactions` y `Payments` para movimientos financieros.
- `OrderStatusHistory` y `AuditLogs` para trazabilidad.

La API continua usando memoria hasta verificar una instancia SQL Server local y configurar credenciales mediante variables de entorno. No se almacenaran contrasenas ni claves API en texto plano.

Reglas:

1. Las rutas solo conectan HTTP con controladores.
2. Los controladores traducen request/response; no contienen reglas de negocio.
3. Los servicios representan casos de uso.
4. Los repositorios encapsulan persistencia y pueden sustituirse por una base de datos.
5. La validacion ocurre en el borde HTTP y las invariantes criticas tambien se verifican en el caso de uso.
6. Los modulos no importan rutas ni estado interno de otros modulos.

Patrones aplicables:

- Modular Monolith como arquitectura general.
- Clean/Hexagonal Architecture dentro de cada modulo cuando crezca.
- Repository para persistencia.
- Service/Use Case para negocio.
- DTO y Mapper para separar contratos HTTP del dominio.
- Adapter para WhatsApp, correo, pagos y proveedores de agenda.

## Limpieza segura

Se conservaran hasta probar lo contrario:

- Configuracion de Angular, TypeScript y npm.
- Codigo referenciado por rutas activas.
- Backend de ordenes mientras el panel SMM siga publicado en `/smm`.
- Archivos no versionados que ya existian antes de esta reorganizacion.

Candidatos a eliminar o mover, despues de confirmar referencias:

- `frontend/src/app/pages/hvac-services/`, plantilla suelta fuera de las rutas activas.
- Modelos backend vacios que no son importados por ningun modulo.
- Features SMM auxiliares que no tengan ruta ni referencia.
- `dist/` y caches generados, si no son artefactos intencionales del repositorio.
- Documentacion duplicada que describe nombres o contratos obsoletos.

Cada limpieza debe seguir este orden:

1. Buscar referencias.
2. Ejecutar build o check del area afectada.
3. Eliminar solo archivos confirmados como huerfanos.
4. Ejecutar nuevamente la validacion.
5. Registrar la decision en esta documentacion si afecta a una frontera de modulo.

## Orden de implementacion

1. Separar y documentar Climatech frente a SMM.
2. Eliminar la plantilla HVAC huerfana y modelos backend vacios confirmados.
3. Extraer la logica de cotizacion a un servicio Strategy y cubrirla con pruebas.
4. Extraer booking a una facade frontend y un modulo backend.
5. Centralizar DTOs y configuracion de API.
6. Añadir pruebas unitarias, integracion y E2E para los flujos publicos.
7. Revisar seguridad, accesibilidad y rendimiento.
