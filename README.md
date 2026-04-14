#  ShoeStore

Plataforma de e-commerce para tienda de zapatos, con panel de administración, catálogo público, autenticación y gestión de configuración dinámica.

---

## Demo

- **Frontend (cliente + admin):** [Demo en etapa de produccion] (solo disponible bajo solicitud)}
- **Backend (API):** Railway (privado)

---

##  Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Vistas del Cliente](#-vistas-del-cliente)
- [Panel de Administración](#-panel-de-administración)

---

## Características

### Público
- Landing page con carrusel hero dinámico (imágenes configurables)
- Catálogo de productos con filtros por categoría, precio y búsqueda
- Integración directa con WhatsApp para consultas
- Diseño responsive (mobile-first)

### Panel de Administración
-  Autenticación con JWT (roles: admin / usuario)
-  CRUD completo de productos (nombre, precio, tallas, imágenes múltiples, categoría, stock)
- CRUD de categorías
-  Gestión de usuarios
- Configuración dinámica de la tienda (nombre, email, dirección, WhatsApp, imágenes del hero)

---

##  Stack Tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| Vue 3 (Composition API) | Framework principal |
| Pinia | Gestión de estado global |
| Vue Router | Navegación SPA |
| Vite | Bundler y dev server |
| Vercel | Deploy y hosting |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor HTTP y API REST |
| MongoDB + Mongoose | Base de datos y ODM |
| JWT | Autenticación y autorización |
| bcryptjs | Hash de contraseñas |
| Railway | Deploy y hosting |

---

## Estructura del Proyecto

```
shoestore/
├── frontend/                   # Vue 3 + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # AppToast, ImageUploader, etc.
│   │   │   ├── product/        # ProductCard, ProductForm
│   │   │   └── layout/         # Navbar, Footer
│   │   ├── views/
│   │   │   ├── HomeView.vue
│   │   │   ├── CatalogoView.vue
│   │   │   ├── LoginView.vue
│   │   │   └── admin/
│   │   │       ├── DashboardView.vue
│   │   │       ├── ProductsView.vue
│   │   │       ├── CategoriesView.vue
│   │   │       ├── UsersView.vue
│   │   │       └── SettingsView.vue
│   │   ├── stores/
│   │   │   ├── auth.store.js
│   │   │   ├── products.store.js
│   │   │   ├── categories.store.js
│   │   │   └── settings.store.js
│   │   ├── services/
│   │   │   └── api.js          # Axios instance con interceptors
│   │   ├── composables/
│   │   │   └── useToast.js
│   │   └── router/
│   │       └── index.js        # Rutas con guards de autenticación
│   └── vite.config.js
│
└── backend/                    # Express + MongoDB
    ├── src/
    │   ├── models/
    │   │
    │   ├── routes/
    │   │   
    │   ├── controllers/
    │   │   
    │   ├── middlewares/
    │   │   
    │   └── config/
    │  
    └── index.js
```

---

##  Instalación y Configuración

### Prerrequisitos

- Node.js >= 18
- MongoDB (local o Atlas)
- Git

### 1 — Clonar el repositorio

```bash
git clone https://github.com/alexgarzom/shoestore.git
cd shoestore
```

### 2 — Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3 — Configurar variables de entorno

Crea los archivos `.env` en cada carpeta (ver sección Variables de Entorno).

### 4 — Ejecutar en desarrollo

```bash
# Backend (desde /backend)
npm run dev        # corre en http://localhost:3000

# Frontend (desde /frontend)
npm run dev        # corre en http://localhost:5173
```

---

## Variables de Entorno

### Backend — `/backend/.env`

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/shoestore
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend — `/frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

### Variables de producción en Vercel / Railway

Configura las mismas variables en los paneles de Vercel (frontend) y Railway (backend) reemplazando los valores por los de producción.

---

## 📡 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login de usuario | ❌ |
| `POST` | `/api/auth/register` | Registro (admin only) | ✅ Admin |
| `GET` | `/api/auth/me` | Perfil del usuario actual | ✅ |

### Productos

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/products` | Listar productos (filtros: category, limit, search) | ❌ |
| `GET` | `/api/products/:id` | Obtener producto por ID | ❌ |
| `POST` | `/api/products` | Crear producto | ✅ Admin |
| `PUT` | `/api/products/:id` | Actualizar producto | ✅ Admin |
| `DELETE` | `/api/products/:id` | Eliminar producto | ✅ Admin |

### Categorías

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/categories` | Listar categorías | ❌ |
| `POST` | `/api/categories` | Crear categoría | ✅ Admin |
| `PUT` | `/api/categories/:id` | Actualizar categoría | ✅ Admin |
| `DELETE` | `/api/categories/:id` | Eliminar categoría | ✅ Admin |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/users` | Listar usuarios | ✅ Admin |
| `PUT` | `/api/users/:id` | Actualizar usuario | ✅ Admin |
| `DELETE` | `/api/users/:id` | Eliminar usuario | ✅ Admin |

### Configuración

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/settings` | Obtener configuración de la tienda | ❌ |
| `PUT` | `/api/settings` | Actualizar configuración | ✅ Admin |

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)**:

1. El usuario hace login con email + contraseña
2. El backend valida y devuelve un `token` JWT
3. El frontend almacena el token y lo adjunta en el header de cada request protegido:

```
Authorization: Bearer <token>
```

### Roles

| Rol | Descripción |
|---|---|
| `admin` | Acceso completo al panel de administración |
| `user` | Acceso solo a vistas públicas |

### Guards en Vue Router

Las rutas del panel admin están protegidas con un navigation guard que verifica el token y el rol antes de permitir el acceso:

```javascript
// Rutas protegidas → redirige a /login si no hay sesión activa
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

---

## 🖥️ Vistas del Cliente

### Home (`/`)
- Carrusel hero con imágenes configurables desde el panel admin
- Sección de categorías dinámicas
- Productos destacados (primeros 6)
- CTA de contacto por WhatsApp

### Catálogo (`/catalogo`)
- Grid de productos con filtro por categoría
- Búsqueda por nombre
- Filtro por rango de precio
- Vista responsiva mobile-first

---

## 🔧 Panel de Administración

Accesible en `/admin` (requiere rol `admin`).

| Vista | Ruta | Descripción |
|---|---|---|
| Dashboard | `/admin` | Resumen general |
| Productos | `/admin/productos` | CRUD de productos |
| Categorías | `/admin/categorias` | CRUD de categorías |
| Usuarios | `/admin/usuarios` | Gestión de usuarios |
| Configuración | `/admin/configuracion` | Datos de la tienda, imágenes hero, WhatsApp |

---

## 🚀 Deploy

### Frontend → Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno en **Settings → Environment Variables**
3. Cada push a `main` genera un deploy automático

### Backend → Railway

1. Conecta el repositorio en [railway.app](https://railway.app)
2. Agrega un servicio de MongoDB o usa MongoDB Atlas
3. Configura las variables de entorno en el panel de Railway
4. Railway redeploya automáticamente en cada push a `main`


## 📄 Licencia

MIT
