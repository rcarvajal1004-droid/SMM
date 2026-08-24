# SMM Panel Backend

API backend para el panel SMM desarrollado en Node.js + Express.

## Arquitectura

```
src/
	config/       Configuración por entorno
	middleware/   Request IDs, validación y errores
	modules/      Lógica por dominio (orders)
	models/       Modelos compatibles con JavaScript
	routes/       Composición HTTP compatible
```

Las rutas existentes se mantienen para no romper el frontend.

## Estructura

```
backend/
├── src/
│   ├── models/
│   │   ├── SmmService.js
│   │   ├── SmmOrder.js
│   │   ├── UserProfile.js
│   │   └── index.js
│   ├── routes/
│   │   ├── services.js
│   │   ├── orders.js
│   │   ├── balance.js
│   │   └── profile.js
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── interceptors/
│   └── index.js
├── package.json
└── README.md
```

## Rutas

- GET `/api/smm/services`
- GET `/api/smm/services/:id`
- POST `/api/smm/orders`
- GET `/api/smm/orders`
- GET `/api/smm/balance`
- POST `/api/smm/balance/add`
- GET `/api/smm/profile`

## Scripts

```bash
npm install
npm start
npm run dev
npm run check
```

## Configuración

Variables opcionales:

```bash
PORT=3000
CORS_ORIGIN=http://localhost:4200
NODE_ENV=development
```

Health check: `GET /health`.

Las órdenes validan `serviceId`, nombre, URL HTTP/HTTPS, cantidad y cargo antes de crearse. Las respuestas de error incluyen `requestId` para facilitar el seguimiento en logs.
