# SMM Panel Backend

API backend para el panel SMM desarrollado en Node.js + Express.

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
```
