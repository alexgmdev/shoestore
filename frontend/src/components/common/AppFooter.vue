<script setup>
import { useSettingsStore } from '@/stores/settings.store'
const settingsStore = useSettingsStore()
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__brand">
        <span class="footer__logo">{{ settingsStore.storeName }}</span>
        <p class="footer__tagline">Estilo y comodidad en cada paso.</p>
      </div>
      <nav class="footer__links" aria-label="Links del footer">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/catalogo">Catálogo</RouterLink>
        <RouterLink to="/login">Mi cuenta</RouterLink>
      </nav>
      <div class="footer__contact">
        <p v-if="settingsStore.storeEmail">{{ settingsStore.storeEmail }}</p>
        <p v-if="settingsStore.storeAddress">{{ settingsStore.storeAddress }}</p>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© {{ new Date().getFullYear() }} {{ settingsStore.storeName }}. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-primary);
  color: white;
  margin-top: 80px;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.footer__logo {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.footer__tagline {
  margin-top: 8px;
  color: rgba(255,255,255,0.65);
  font-size: 0.9rem;
}

.footer__links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__links a {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.95rem;
  transition: var(--transition);
}

.footer__links a:hover { color: white; }

.footer__contact p {
  color: rgba(255,255,255,0.65);
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.footer__bottom {
  border-top: 1px solid rgba(255,255,255,0.15);
  text-align: center;
  padding: 20px 24px;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
}
</style>