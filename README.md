# 🏋️ GymBook — Plataforma de Reservas con Cupo Limitado

Plataforma para que los socios de un gimnasio reserven cupos en clases grupales con
manejo de **concurrencia real**, actualizaciones en **tiempo real via SSE** y arquitectura
completamente **dockerizada**.

---

## 🚀 Arquitectura del Proyecto

El sistema se divide en dos capas independientes:

- **Backend**: Node.js + Express + TypeScript con arquitectura por capas
- **Frontend**: Angular 22 + PrimeNG con componentes standalone

---

## 🗄️ Stack Tecnológico

| Capa        | Tecnología                          |
|-------------|-------------------------------------|
| Frontend    | Angular 22 + PrimeNG + PrimeFlex    |
| Backend     | Node.js 20 + Express + TypeScript   |
| Base datos  | MongoDB 7 (Docker)                  |
| Tiempo real | Server-Sent Events (SSE)            |
| Auth        | JWT + bcrypt (cost 10)              |
| Container   | Docker + Docker Compose             |

---

## ⚡ Levantar el sistema en menos de 5 minutos

### Requisitos previos
- Docker y Docker Compose instalados
- Node.js 20+ (solo para el frontend)

### 1. Clonar el repositorio
```bash
git clone https://github.com/neoaxjordan/gymbook-reservas.git
cd gymbook-reservas
```

### 2. Configurar variables de entorno
```bash
cp backend/.env.example backend/.env
```

### 3. Levantar backend + MongoDB + Seed
```bash
docker compose up --build
```

Esto levanta automáticamente:
- ✅ MongoDB en `localhost:27017`
- ✅ Backend en `localhost:3000`
- ✅ Seed con usuarios y clases de prueba

### 4. Levantar el frontend
```bash
cd frontend
npm install
ng serve
```

Frontend disponible en **`http://localhost:4200`**

---

## 🔑 Credenciales de prueba

| Rol    | Email               | Contraseña   |
|--------|---------------------|--------------|
| Admin  | admin@gym.com       | password123  |
| Client | cgarcia@gym.com     | password1111 |

---

## 🔧 Variables de entorno

Ver `backend/.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/gymbook
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
```

---

## 🌱 Seed manual

Si necesitas reinicializar la base de datos:

```bash
cd backend
npm run seed
```

---

## 🧪 Correr los tests

```bash
cd backend
npm test
```

---

## 🛠️ Endpoints de la API

### Autenticación (públicos)
| Método | Endpoint         | Descripción |
|--------|------------------|-------------|
| POST   | /auth/login      | Login       |
| POST   | /auth/register   | Registro    |

### Clases (protegidos con Bearer Token)
| Método | Endpoint                         | Descripción            |
|--------|----------------------------------|------------------------|
| GET    | /api/reservations/class          | Listar clases activas  |
| GET    | /api/reservations/classes/events | SSE tiempo real        |

### Reservas (protegidos con Bearer Token)
| Método | Endpoint                            | Descripción       |
|--------|-------------------------------------|-------------------|
| POST   | /api/reservations                   | Crear reserva     |
| PATCH  | /api/reservations/:id/cancel        | Cancelar reserva  |
| GET    | /api/reservations/user/:userId      | Mis reservas      |

---

## 📦 Estructura del proyecto

```
gymbook-reservas/
├── backend/
│   ├── src/
│   │   ├── config/scripts/     # Seed de datos iniciales
│   │   ├── controllers/        # Lógica HTTP
│   │   ├── middleware/         # Auth, roles, validación, logging
│   │   ├── models/             # Esquemas Mongoose + DTOs
│   │   ├── routes/             # Definición de endpoints
│   │   └── services/           # Reglas de negocio y concurrencia
│   ├── Dockerfile              # Multi-stage, usuario no-root
│   └── .env.example
├── frontend/
│   └── src/app/
│       ├── core/               # Services, guards, interceptors
│       ├── features/           # Auth, classes, my-reservations
│       └── shared/             # Models, utils, components
├── docs/
│   ├── adr/                    # 4 Architecture Decision Records
│   └── sequence-diagram.md     # Diagrama de secuencia de reserva
├── docker-compose.yml
└── README.md
```

---

## 📝 Notas técnicas

- **Concurrencia**: Resuelta con `findOneAndUpdate` atómico de MongoDB — garantiza
  exactamente una reserva confirmada ante N requests simultáneos al último cupo.
- **Idempotencia**: Cada request incluye un `idempotencyKey` (UUID) que previene
  doble reserva por reintentos del cliente.
- **Tiempo real**: SSE notifica a todos los clientes conectados cuando cambia un cupo,
  sin polling y sin dependencias adicionales.
- **Logs estructurados**: Cada request genera un log JSON con `timestamp`, `requestId`,
  `method`, `url`, `status`, `durationMs` y `userId`.

---

## ⚠️ Compromisos asumidos

### Qué dejé sin hacer por tiempo
- **Tests de concurrencia automatizados**: la lógica está resuelta pero falta el test
  que lo demuestre con N requests simultáneos. Es el punto más crítico pendiente.
- **Frontend dockerizado**: el frontend corre con `ng serve`. Dockerizarlo con Nginx
  es un nice-to-have del documento que no alcancé a completar.
- **Pipeline CI/CD activo**: el plan está documentado en `CI_PLAN.md` pero el pipeline
  no está activo en GitHub Actions.
- **Logout server-side**: el token se elimina en el cliente pero no hay blacklist
  en el servidor.

### Qué haría distinto en producción
- **MongoDB con autenticación**: la instancia actual no tiene usuario/contraseña.
- **Redis**: para blacklist de tokens, SSE pub/sub multi-instancia y caché.
- **Refresh tokens**: tokens de corta duración con refresh para mejor seguridad.
- **Rate limiting**: protección en endpoints de auth y reservas.
- **Frontend en CDN**: build estático servido desde CDN con Nginx en Docker.

---

## 👨‍💻 Autor

**Alex Jordan**
*Senior Full-Stack Engineer & Solutions Architect*