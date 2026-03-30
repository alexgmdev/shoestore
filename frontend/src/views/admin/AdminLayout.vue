<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar__header">
        <RouterLink to="/" class="sidebar__logo">ShoeStore</RouterLink>
        <span class="sidebar__badge">Admin</span>
      </div>

      <nav class="sidebar__nav" aria-label="Menú administrador">
        <RouterLink to="/admin" exact class="sidebar__link">
          <span>📊</span> Dashboard
        </RouterLink>
        <RouterLink to="/admin/productos" class="sidebar__link">
          <span>👟</span> Productos
        </RouterLink>
        <RouterLink to="/admin/usuarios" class="sidebar__link">
          <span>👥</span> Usuarios
        </RouterLink>
        <RouterLink to="/admin/configuracion" class="sidebar__link">
          <span>⚙️</span> Configuración
        </RouterLink>
        <RouterLink to="/admin/categorias" class="sidebar__link">
         <span>🏷️</span> Categorías
        </RouterLink>
      </nav>

      <div class="sidebar__footer">
        <span class="sidebar__user">{{ authStore.user?.name }}</span>
        <button class="sidebar__logout" @click="logout">Cerrar sesión</button>
      </div>
    </aside>

    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--color-primary);
  color: white;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar__header {
  padding: 24px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar__logo {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 800;
}

.sidebar__badge {
  font-size: 0.65rem;
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar__nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 500;
  transition: var(--transition);
}

.sidebar__link:hover,
.sidebar__link.router-link-active {
  background: rgba(255,255,255,0.15);
  color: white;
}

.sidebar__footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar__user {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.65);
}

.sidebar__logout {
  background: rgba(255,255,255,0.1);
  color: white;
  border: none;
  padding: 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  transition: var(--transition);
}

.sidebar__logout:hover { background: rgba(255,255,255,0.2); }

.admin-main {
  background: var(--color-background);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout { grid-template-columns: 1fr; }
  .sidebar { height: auto; position: static; }
}
</style>