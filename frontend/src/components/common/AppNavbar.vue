<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSettingsStore } from '@/stores/settings.store'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const menuOpen = ref(false)

const logout = () => {
  authStore.logout()
  router.push('/')
  menuOpen.value = false
}
</script>

<template>
  <header class="navbar" role="banner">
    <div class="navbar__container">
      <RouterLink to="/" class="navbar__logo">
        {{ settingsStore.storeName }}
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="navbar__nav" aria-label="Navegación principal">
        <RouterLink to="/" class="navbar__link">Inicio</RouterLink>
        <RouterLink to="/catalogo" class="navbar__link">Catálogo</RouterLink>
      </nav>

      <!-- Actions -->
      <div class="navbar__actions">
        <template v-if="authStore.isAuthenticated">
          <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar__link">
            Admin
          </RouterLink>
          <button class="navbar__btn-logout" @click="logout">Salir</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="navbar__link">Iniciar sesión</RouterLink>
          <RouterLink to="/registro" class="navbar__btn-primary">Registrarse</RouterLink>
        </template>

        <!-- Hamburger mobile -->
        <button
          class="navbar__hamburger"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-label="Abrir menú"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="navbar__mobile" :class="{ 'navbar__mobile--open': menuOpen }">
      <RouterLink to="/" class="navbar__mobile-link" @click="menuOpen = false">Inicio</RouterLink>
      <RouterLink to="/catalogo" class="navbar__mobile-link" @click="menuOpen = false">Catálogo</RouterLink>
      <template v-if="authStore.isAuthenticated">
        <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar__mobile-link" @click="menuOpen = false">Admin</RouterLink>
        <button class="navbar__mobile-link navbar__mobile-link--btn" @click="logout">Salir</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="navbar__mobile-link" @click="menuOpen = false">Iniciar sesión</RouterLink>
        <RouterLink to="/registro" class="navbar__mobile-link" @click="menuOpen = false">Registrarse</RouterLink>
      </template>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.navbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.navbar__logo {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-primary);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.navbar__nav {
  display: flex;
  gap: 8px;
}

.navbar__link {
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  font-size: 0.95rem;
}

.navbar__link:hover, .navbar__link.router-link-active {
  background: var(--color-background);
  color: var(--color-primary);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar__btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition);
}

.navbar__btn-primary:hover { background: var(--color-primary-hover); }

.navbar__btn-logout {
  background: none;
  border: 1.5px solid var(--color-border);
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
}

.navbar__btn-logout:hover { border-color: var(--color-primary); }

.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.navbar__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: var(--transition);
}

.navbar__mobile {
  display: none;
  flex-direction: column;
  padding: 12px 24px 16px;
  border-top: 1px solid var(--color-border);
  background: white;
}

.navbar__mobile--open { display: flex; }

.navbar__mobile-link {
  padding: 12px 0;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  border-bottom: 1px solid var(--color-border);
  transition: var(--transition);
}

.navbar__mobile-link--btn {
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .navbar__nav { display: none; }
  .navbar__actions .navbar__link,
  .navbar__actions .navbar__btn-primary,
  .navbar__actions .navbar__btn-logout { display: none; }
  .navbar__hamburger { display: flex; }
}
</style>