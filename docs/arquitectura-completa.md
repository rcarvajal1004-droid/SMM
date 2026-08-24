# SMM Digital Service Platform — Documentación de Configuración Completa

> **Proyecto:** Stitch Climatech Digital Service Platform  
> **Ámbito:** Frontend (Angular 22) + Backend (Node.js/Express)  
> **Propósito:** Plataforma digital para refacciones, minisplits y servicios HVAC/eléctricos.

---

## 1. Arquitectura General

```
stitch_climatech_digital_service_platform/
├── backend/               # API REST en Node.js + Express
├── frontend/              # Aplicación cliente SPA en Angular 22 (standalone)
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts / app.html              # Root component + router-outlet
│   │   │   ├── app.config.ts                  # Providers globales
│   │   │   ├── app.routes.ts                  # Router raíz (Lazy load)
│   │   │   ├── core/                          # Services singletons, interceptors, guards
│   │   │   ├── layout/                        # Navbar, Footer, Toast
│   │   │   ├── features/
│   │   │   │   ├── climatech/                 # Rutas públicas (Home, HVAC, Booking, Quote, etc.)
│   │   │   │   ├── smm/                       # Rutas SMM Panel (Dashboard, Orders, Services)
│   │   │   │   ├── spotlight/, landing/       # Componentes auxiliares
│   │   │   └── shared/                        # Directives, pipes (GSAP, Lenis)
│   │   ├── styles.css                         # CSS global
│   │   └── index.html                         # Tailwind CDN config, Material Symbols
│   ├── angular.json                          # Configuración build/serve
│   ├── tsconfig.json / tsconfig.app.json       # TypeScript
│   ├── package.json
│   └── vite.config.ts (opcional)            # No presente en este proyecto
├── .kilo/                 # Configuración Kilo (agentes, comandos, skills)
└── package.json raiz      # Solo workspace root
```

**Patrón:** SPA multitenant.  
- Public site (`/` → `ClimatechLayoutComponent` con Navbar/Footer/Toast + WhatsApp FAB).  
- SMM Panel (`/smm/` → `SmmLayoutComponent` con `NgxSonnerToaster`).  
- Comunicación con backend vía `HttpClient` + `AuthInterceptor`.

---

## 2. Backend — Configuración Completa

### 2.1 package.json
```json
{
  "name": "smm-backend",
  "version": "1.0.0",
  "description": "Backend API for SMM Panel",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "check": "node --check src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

### 2.2 Variables de Entorno (`src/config/env.js`)
```js
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 3000),
  allowedOrigins,          // CORS allowlist (array)
  nodeEnv: process.env.NODE_ENV || 'development'
};
```

| Variable       | Default                  | Descripción                          |
|----------------|--------------------------|--------------------------------------|
| `PORT`         | `3000`                   | Puerto del servidor                   |
| `CORS_ORIGIN`  | `http://localhost:4200`  | Origen(es) permitidos (coma-separados)|
| `NODE_ENV`     | `development`            | `development` / `production`          |

### 2.3 Punto de Entrada (`src/index.js`)
- **Framework:** Express 4.x  
- **Middleware global:**
  - `cors({ origin: env.allowedOrigins })` — CORS dinámico desde allowlist.
  - `express.json({ limit: '100kb' })` — Body parsing con límite.
  - `requestId` — Genera `x-request-id` (UUID) para tracing.
- **Health check:** `GET /health` → `{ status: 'ok', service: 'smm-backend', environment }`.
- **Routes montadas:**
  - `/api/smm/services` → `servicesRouter`
  - `/api/smm/orders` → `ordersRouter`
  - `/api/smm/balance` → `balanceRouter`
  - `/api/smm/profile` → `profileRouter`
- **Error handling:** `notFound` (404) → `errorHandler` (500/4xx con `requestId` en respuesta).

### 2.4 Middleware

| Archivo | Función |
|---------|---------|
| `middleware/request-id.js` | Genera `crypto.randomUUID()` o reusa `x-request-id` header; lo expone como `req.requestId`. |
| `middleware/validate.js` | `validateOrder`: valida `serviceId` (int positivo), `serviceName` (string ≥2 chars), `link` (URL http/https válido), `quantity` (int positivo), `charge` (number ≥0). `validateBalance`: valida `amount` (number 0 < x ≤ 100000). |
| `middleware/error-handler.js` | 404 handler (`notFound`) y manejador de errores unificado con `requestId` en respuesta. |

### 2.5 Modelos (`src/models/`)
| Archivo | Contenido |
|---------|-----------|
| `models/smmservice.js` | Clase vacía `SmmService {}` (esqueleto). |
| `models/smmorder.js` | Clase vacía `SmmOrder {}` (esqueleto). |
| `models/userprofile.js` | Clase vacía `UserProfile {}` (esqueleto). |
| `models/index.js` | Barrel export: `SmmService`, `SmmOrder`, `UserProfile`. |
> **Nota:** Los modelos son esqueletos de JS puro (no usan ORM). La "persistencia" está en memoria dentro de cada router/repository.

### 2.6 Rutas (`src/routes/`)

| Ruta | File | Métodos | Descripción |
|------|------|---------|-------------|
| `/api/smm/services` | `routes/services.js` | GET `/`, GET `/:id` | Lista servicios SMM o uno por ID. |
| `/api/smm/orders` | `routes/orders.js` | GET `/`, POST `/` | Lista órdenes o crea nueva. |
| `/api/smm/balance` | `routes/balance.js` | GET `/`, POST `/add` | Saldo (inicia en 156.75) o añade fondos (valida amount). |
| `/api/smm/profile` | `routes/profile.js` | GET `/` | Retorna perfil mock: `{ id: 1, username: 'demo_user', balance: 156.75, apiKey: 'sk_mock_key' }`. |

### 2.7 Datos In-Memory (Fixtures)

**Servicios (`routes/services.js`):**
Array de 9 servicios con `id, name, category, ratePer1000, min, max, description`. Categorías: Instagram, TikTok, YouTube, Spotify, Telegram.

**Órdenes (`modules/orders/orders.repository.js`):**
1. `findAll()` — Devuelve copia del array.
2. `create(order)` — Prepend con `id: Date.now()`, `status: 'Pending'`, `createdAt: ISO date`.

**Balance (`routes/balance.js`):**
Variable `let balance = 156.75`.

### 2.8 Módulos (`src/modules/orders/`)
| Archivo | Responsabilidad |
|---------|-----------------|
| `orders.controller.js` | `GET /` (list), `POST /` (validateOrder → create). |
| `orders.service.js` | Delegación a repository. |
| `orders.repository.js` | Estado in-memory + lógica de negocio. |

### 2.9 Interfaz de Comunicación Backend → Frontend
- **Protocolo:** HTTP/HTTPS  
- **Formato:** JSON (`express.json()` en body parsing)  
- **CORS:** Configurable vía `CORS_ORIGIN` (default `http://localhost:4200`)  
- **Request ID:** Todas las respuestas de error incluyen `requestId` (UUIDv4).

---

## 3. Frontend — Configuración Completa

### 3.1 package.json (Dependencies)
```json
{
  "name": "smm",
  "private": true,
  "packageManager": "npm@10.9.8",
  "dependencies": {
    "@angular/common": "^22.1.0",
    "@angular/compiler": "^22.1.0",
    "@angular/core": "^22.1.0",
    "@angular/forms": "^22.1.0",
    "@angular/platform-browser": "^22.1.0",
    "@angular/router": "^22.1.0",
    "@lucide/angular": "^1.33.0",
    "canvas-confetti": "^1.9.4",
    "chart.js": "^4.5.1",
    "gsap": "^3.15.0",
    "lenis": "^1.3.26",
    "ng2-charts": "^10.0.0",
    "ngx-sonner": "^3.1.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  },
  "devDependencies": {
    "@angular/build": "^22.1.5",
    "@angular/cli": "^22.1.5",
    "@angular/compiler-cli": "^22.1.0",
    "jsdom": "^28.0.0",
    "prettier": "^3.8.1",
    "typescript": "~6.0.2",
    "vitest": "^4.0.8"
  }
}
```

### 3.2 TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "preserve",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true
  },
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.spec.json" }
  ]
}
```
- `strict: true`, `isolatedModules: true` — Angular 22 best practices.  
- `strictInjectionParameters` — Inyección estricta de dependencias.  
- `strictInputAccessModifiers` — Inputs readonly por defecto.

### 3.3 angular.json — Build & Serve
```json
{
  "projects": {
    "smm": {
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [{ "glob": "**/*", "input": "public" }],
            "styles": ["src/styles.css"]
          },
          "configurations": {
            "production": {
              "budgets": [
                { "type": "initial", "maximumWarning": "800kB", "maximumError": "1.5MB" },
                { "type": "anyComponentStyle", "maximumWarning": "20kB", "maximumError": "30kB" }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```
- **Budgets:** Initial < 800kB warn / 1.5MB error. Component styles < 20kB warn / 30kB error.  
- **Prod build:** `outputHashing: all`, `defaultConfiguration: production`.  
- **Dev serve:** Source maps activados, optimizations desactivadas.

### 3.4 App Root (`src/main.ts`)
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

### 3.5 App Config (`src/app/app.config.ts`)
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),   // Global error capture
    provideRouter(routes),                  // Routing
    provideHttpClient(
      withInterceptors([authInterceptor])   // AuthInterceptor global
    ),
    provideCharts(withDefaultRegisterables())  // ng2-charts / Chart.js
  ]
};
```

### 3.6 Routing (`src/app/app.routes.ts`)
```ts
export const routes: Routes = [
  ...CLIMATECH_ROUTES,                     // Rutas públicas
  { path: 'smm', children: SMM_ROUTES },   // Rutas SMM Panel (lazy)
  { path: '**', redirectTo: '' }           // Wildcard → Home
];
```

#### 3.6.1 Climatech Routes (`features/climatech/climatech.routes.ts`)
Layout: `ClimatechLayoutComponent` (Navbar + RouterOutlet + Footer + Toast + WhatsApp FAB).

| Path | Component | Description |
|------|-----------|-------------|
| `''` / `'home'` | `HomeComponent` | Landing principal |
| `'hvac-services'` | `HvacServicesComponent` | Servicios HVAC |
| `'electrical-services'` | `ElectricalServicesComponent` | Servicios eléctricos |
| `'booking'` | `BookingComponent` | Agendar visita técnica |
| `'quote-tool'` | `QuoteToolComponent` | Cotizador de proyectos |
| `'diagnostico'` | `DiagnosticComponent` | Diagnóstico de eficiencia |
| `'ayuda'` | `HelpCenterComponent` | Centro de ayuda |

#### 3.6.2 SMM Routes (`features/smm-layout/smm-layout.routes.ts`)
Layout: `SmmLayoutComponent` (`<router-outlet>` + `NgxSonnerToaster`).

| Path | Component | Description |
|------|-----------|-------------|
| `''` | `HomeComponent` | Dashboard SMM |
| `'dashboard'` | `DashboardComponent` | Panel administrativo |
| `'orders/new'` | `NewOrderComponent` | Crear orden |
| `'orders/history'` | `OrderHistoryComponent` | Historial de órdenes |
| `'services'` | `ServicesComponent` | Lista de servicios |
| `'add-funds'` | `AddFundsComponent` | Añadir fondos |

### 3.7 Interceptor de Autenticación (`core/interceptors/auth.interceptor.ts`)
```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = 'YOUR_API_KEY';
  const token = localStorage.getItem('smm_api_key') || apiKey;

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error?.status === 401) console.error('Unauthorized access');
      return throwError(() => error);
    })
  );
};
```
- **API Key fallback:** `'YOUR_API_KEY'` (placeholder).  
- **Storage lookup:** `localStorage.getItem('smm_api_key')`.  
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`.  
- **401 handling:** Log to console (no redirect en esta versión).

### 3.8 Servicio API SMM (`features/smm/data-access/smm-api.service.ts`)
```ts
@Injectable({ providedIn: 'root' })
export class SmmApiService {
  private baseUrl = 'http://localhost:3000/api/smm';

  constructor(private http: HttpClient) {}

  getServices()     { return this.http.get<SmmService[]>(`${baseUrl}/services`).pipe(catchError(() => of([]))); }
  createOrder(order) { return this.http.post<SmmOrder>(`${baseUrl}/orders`, order); }
  getOrders()        { return this.http.get<SmmOrder[]>(`${baseUrl}/orders`).pipe(catchError(() => of([]))); }
  getBalance()       { return this.http.get<{ balance: number }>(`${baseUrl}/balance`).pipe(catchError(() => of({ balance: 0 }))); }
  getProfile()       { return this.http.get<UserProfile>(`${baseUrl}/profile`).pipe(catchError(() => of({ id: 0, username: '', balance: 0, apiKey: '' }))); }
}
```
- **Base URL:** `http://localhost:3000/api/smm` (hardcodeado, sin environment files).  
- **Fallback:** Todos los GET retornan valores por defecto en caso de error (graceful degradation).  
- **POST:** `createOrder` propaga errores (no catch).

### 3.9 Tailwind CSS (CDN en `index.html`)
```html
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: "#006591",
          secondary: "#fea619",
          tertiary-container: "#de8712",
          error: "#ba1a1a",
          // ... ~30 colores Material 3 personalizados
        },
        borderRadius: { "DEFAULT": "0.25rem", sm: "0.25rem", md: "0.75rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem", full: "9999px" },
        spacing: { "margin-mobile": "16px", gutter: "24px", "margin-desktop": "32px", base: "8px", "container-max": "1280px" },
        fontFamily: { "body-lg": ["Inter"], "headline-lg": ["Inter"], "body-md": ["Inter"], ... },
        fontSize: { "body-lg": ["18px", ...], "headline-lg": ["32px", ...], "display-lg": ["48px", ...], ... }
      }
    }
  };
</script>
```
- **Modo oscuro:** `darkMode: "class"` (activado via `ThemeService`).  
- **Fuente:** `Inter` (Google Fonts: 400/600/700/800).  
- **Material Symbols:** `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined`.  
- **Plugins:** `forms`, `container-queries`.

### 3.10 Theme Service (`core/services/theme.service.ts`)
- **Storage key:** `climatech-theme`.  
- **Default:** `dark` (incluso si `prefers-color-scheme` es light).  
- **Toggle:** `toggleTheme()` → `dark ↔ light`.  
- **Aplicación:** Añade/quita `dark` class en `document.documentElement`.

### 3.11 Animation Service (`shared/services/animation.service.ts`)
```ts
@Injectable({ providedIn: 'root' })
export class AnimationService {
  // Lenis smooth scroll + GSAP ScrollTrigger
  init(): void
  countUp(from, to, duration, onUpdate): void
  typewriter(text, speedMs, onChar, onDone?): void
  zoneRunOutside(fn: () => void): void
  get reducedMotion(): boolean
}
```
- **Inicialización (`App.ngOnInit`):** `requestAnimationFrame(() => this.animations.init())` — solo en browser, respeta `prefers-reduced-motion`.  
- **Lenis config:** `lerp: 0.11`, `smoothWheel: true`, sincronizado con `gsap.ticker`.  
- **`zoneRunOutside`:** Ejecuta GSAP/Lenis fuera de `NgZone` para evitar triggers de detección de cambios.  
- **`countUp`:** Usa `gsap.to` con `onUpdate` dentro de `NgZone`.  
- **`typewriter`:** Bucle `setTimeout` con borrado/reescritura.

### 3.12 GSAP Reveal Directive (`shared/directives/gs-reveal.directive.ts`)
```ts
@Directive({ selector: '[gsReveal]', standalone: true })
export class GsRevealDirective {
  @Input('gsReveal') delay: number | string = 0;
  @Input() gsRevealStagger = 0.12;

  ngAfterViewInit(): void {
    // IntersectionObserver → gsap.from/to con opacity, y, stagger
    // Respeta prefers-reduced-motion (opacity=1, sin animación)
  }
}
```
- **Targets:** `.reveal-item` hijos o el propio elemento.  
- **Threshold:** 0.15, `rootMargin: '0px 0px -40px 0px'`.  
- **Animación:** `opacity → 1`, `y → 0`, duración 1s, `ease: 'power3.out'`, `stagger: 0.12` para items.

### 3.13 Toast Service (`core/services/toast.service.ts`)
```ts
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  show(title, message?, type = 'info', duration = 4000): void
  success(title, message?, duration?): void
  info(title, message?, duration?): void
  warning(title, message?, duration?): void
  error(title, message?, duration?): void
  remove(id): void
}
```
- **Tipo de datos:** Signal-based (Angular 22 reactive).  
- **Auto-cierre:** `setTimeout` opcional (0 = persiste).  
- **Consumido por:** `ToastComponent` (renderiza lista).

### 3.14 Confetti Service (`core/services/confetti.service.ts`)
- **Librería:** `canvas-confetti`.  
- **Ejecución:** `ngZone.runOutsideAngular()` (evita triggers de detección).  
- **Métodos:** `celebrate(x, y)` (100 partículas, spread 70), `smallCelebration()` (30 partículas).  
- **Colores corporativos:** `#006591`, `#de8712`, `#0ea5e9`, `#131b2e`.

### 3.15 Business Contact Config (`core/config/business-contact.config.ts`)
```ts
export const BUSINESS_CONTACT = {
  name: 'Refacciones aire acondicionado y venta de Minisplit SMM',
  phone: '528139109310',
  coordinates: '25.6671356,-100.4375599',
  mapsUrl: 'https://www.google.com/maps/place/...',
  mapsEmbedUrl: 'https://www.google.com/maps?q=25.6671356,-100.4375599&z=15&output=embed',
  whatsappMessage: 'Hola SMM, me gustaría recibir información sobre sus servicios.'
} as const;

export const BUSINESS_CONTACT_LINKS = {
  whatsapp: `https://wa.me/${BUSINESS_CONTACT.phone}?text=${encodeURIComponent(BUSINESS_CONTACT.whatsappMessage)}`
} as const;
```
- **Ubicación:** Monterrey, Nuevo León, México.  
- **WhatsApp:** FAB fijo en layout (`bottom-6 left-6`), botón en footer.

### 3.16 Layout Components

#### Navbar (`layout/navbar/navbar.component.ts` + `.html` + `.css`)
- **Position:** `fixed top-0 w-full z-50`, backdrop blur, border-bottom.  
- **Brand:** Link a `/` con nombre comercial completo.  
- **Status Badge:** "3 Técnicos en guardia" (solo desktop).  
- **Nav links:** Home, HVAC Services, Electrical Services, Quote Tool, Booking, Diagnóstico, Centro de ayuda.  
- **Theme toggle:** Botón con icono `light_mode`/`dark_mode` + rotación 180°.  
- **Mobile drawer:** Slide-down con `animate-fade-in-up`.  
- **Mobile action buttons:** Theme toggle + hamburger menu.

#### Footer (`layout/footer/footer.component.ts` + `.html` + `.css`)
- **Grid:** `md:grid-cols-12` — Brand/info (col-span-5), Servicios (2), Herramientas (2), Ubicación (3), Copyright (full width).  
- **CTA destacada:** "Solicita tu visita técnica" (WhatsApp).  
- **Copyright:** `&copy; {{ currentYear }}` dinámico.

#### Climatech Layout (`layout/climatech/climatech-layout.component.ts`)
- **Template inline:** Navbar → RouterOutlet → Footer → Toast → WhatsApp FAB.  
- **WhatsApp FAB:** `fixed bottom-6 left-6 z-50`, bg `#25D366`, hover `scale-110`.

#### SMM Layout (`features/smm-layout/smm-layout.component.ts`)
- **Template inline:** `<router-outlet>` + `NgxSonnerToaster` (bottom-right, rich colors, close button).

---

## 4. Models Shared (Angular)

### `src/app/features/smm/models/smm.model.ts`
```ts
export interface SmmService {
  id: number; name: string; category: string;
  ratePer1000: number; min: number; max: number;
  description: string;
}

export interface SmmOrder {
  id: number; serviceId: number; serviceName: string;
  link: string; quantity: number; charge: number;
  status: string; createdAt: string;
}

export interface UserProfile {
  id: number; username: string; balance: number; apiKey: string;
}
```

---

## 5. Conexión Frontend ↔ Backend

### 5.1 Endpoints

| Método | Endpoint | Component/Service | Descripción |
|--------|----------|-------------------|-------------|
| GET | `/api/smm/services` | `SmmApiService.getServices()` | Lista los 9 servicios con precios. |
| GET | `/api/smm/services/:id` | — | Detalle de un servicio (no usado por frontend actual). |
| POST | `/api/smm/orders` | `SmmApiService.createOrder()` | Crea orden con validación (middleware). |
| GET | `/api/smm/orders` | `SmmApiService.getOrders()` | Lista órdenes in-memory. |
| GET | `/api/smm/balance` | `SmmApiService.getBalance()` | Retorna saldo (inicia 156.75). |
| POST | `/api/smm/balance/add` | — | Añade fondos (valida amount ≤ 100000). |
| GET | `/api/smm/profile` | `SmmApiService.getProfile()` | Perfil mock con API key. |
| GET | `/health` | — | Health check (status ok). |

### 5.2 Auth Interceptor
- **Header enviado:** `Authorization: Bearer <smm_api_key | 'YOUR_API_KEY'>`, `Content-Type: application/json`.  
- **401:** Log error en consola (no auth redirect).  
- **Aplicado a todas** las peticiones HTTP del `HttpClient`.

### 5.3 CORS
- **Backend:** `cors({ origin: env.allowedOrigins })` — allowlist desde `CORS_ORIGIN` env var.  
- **Default permitido:** `http://localhost:4200`.  
- **Frontend:** No necesita configuración CORS adicional (browser handle).

### 5.4 URL Base
```ts
// smm-api.service.ts
private baseUrl = 'http://localhost:3000/api/smm';
```
- Hardcodeada a `localhost:3000`.  
- No hay environment files ni proxy configurado.

### 5.5 Flujo de Ordenes (Ejemplo)
1. **Frontend (`NewOrderComponent`):** Usuario llena formulario → valida localmente → llama `SmmApiService.createOrder(order)`.
2. **Interceptor:** Añade headers `Authorization` + `Content-Type`.
3. **Backend (`orders.controller.js`):** 
   - Passa por `validateOrder` middleware (valida serviceId, link, cantidad, charge).
   - Llama `ordersService.create()` → `ordersRepository.create()` (genera id, status "Pending", createdAt).
   - Responde `201 Created` con objeto orden.
4. **Frontend:** Recibe orden creada → notifica con `ConfettiService.celebrate()` o `ToastService`.

---

## 6. Tabla de Colores / Temas

### Paleta Tailwind (desde `index.html`)
| Nombre | Valor |
|--------|-------|
| `primary` | `#006591` (azul corporativo) |
| `secondary` | `#fea619` (ámbar) |
| `secondary-container` | `#fea619` |
| `tertiary-container` | `#de8712` |
| `primary-container` | `#0ea5e9` (sky) |
| `surface` | `#faf8ff` |
| `surface-container-low` | `#f2f3ff` |
| `on-primary` | `#ffffff` |
| `on-background` | `#131b2e` (casi negro) |
| `error` | `#ba1a1a` |

Spacing (8px base grid):
| Token | Valor |
|-------|-------|
| `margin-mobile` | 16px |
| `margin-desktop` | 32px |
| `gutter` | 24px |
| `base` | 8px |
| `container-max` | 1280px |

---

## 7. Cómo Ejecutar

### Backend
```bash
cd backend
npm install
npm run dev          # nodemon-style: node --watch src/index.js
# o
npm start            # producción
npm run check        # verifica sintaxis
```

### Frontend
```bash
cd frontend
npm install
ng serve             # localhost:4200, HMR activado
ng build             # producción (budgets: 800kB/1.5MB)
ng test              # vitest
```

### Environment (.env backend)
```
PORT=3000
CORS_ORIGIN=http://localhost:4200
NODE_ENV=development
```

---

## 8. Testing
- **Frontend:** Vitest (`ng test`).  
- **Backend:** No hay framework de tests configurado. `npm run check` solo valida sintaxis.  
- **E2E:** Playwright headless verifica 0 console errors en rutas Home, HVAC, Quote, Booking.

---

## 9. Notas Técnicas

1. **No hay Redis, base de datos ni ORM** — todo el estado es in-memory. Útil para demo/mock.
2. **No hay environment files** — URLs hardcodeadas en servicios Angular.
3. **CORS permisivo** — allowlist configurable, default a localhost:4200.
4. **Angular Signals** usados en `ThemeService` y `ToastService` (reactividad moderna).
5. **GSAP + Lenis + ScrollTrigger** orquestrados fuera de `NgZone` para performance.
6. **Material 3 design tokens** (colores, spacing, typography) aplicados via Tailwind config.
7. **Responsive grid 12 cols** extendido de Material para hero/brand/home sections.
8. **Accessibility:** `prefers-reduced-motion`, `aria-labels`, `focus-visible`, `focus:ring`.
