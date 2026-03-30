<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import { useSettingsStore } from '@/stores/settings.store'
import { useCategoriesStore } from '@/stores/categories.store'
import ProductCard from '@/components/product/ProductCard.vue'

const productsStore = useProductsStore()
const settingsStore = useSettingsStore()
const categoriesStore = useCategoriesStore()

const currentIndex = ref(0)
let carouselInterval = null

onMounted(async () => {
  await settingsStore.fetchSettings()
  categoriesStore.fetchCategories()
  productsStore.fetchProducts({ limit: 6 })

  carouselInterval = setInterval(() => {
    if (settingsStore.heroImages?.length > 1) {
      currentIndex.value = (currentIndex.value + 1) % settingsStore.heroImages.length
    }
  }, 4000)
})

onUnmounted(() => clearInterval(carouselInterval))
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero__content">
        <p class="hero__eyebrow">Nueva Colección 2026</p>
        <h1 class="hero__title">El estilo<br />que te define</h1>
        <p class="hero__subtitle">Zapatos diseñados para quienes no hacen concesiones entre estilo y comodidad.</p>
        <div class="hero__actions">
          <RouterLink to="/catalogo" class="btn btn--primary">Ver catálogo</RouterLink>
          <a
            :href="`https://wa.me/${settingsStore.whatsappNumber}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--outline"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>

      <!-- Carrusel -->
      <div class="hero__visual">
        <div class="hero__image-wrapper">
          <Transition name="hero-fade" mode="out-in">
            <img
              :key="currentIndex"
              :src="settingsStore.heroImages?.[currentIndex] || settingsStore.imageInicio"
              alt="Zapato destacado"
              class="hero__image"
            />
          </Transition>

          <!-- Dots solo si hay más de 1 imagen -->
          <div class="hero__dots" v-if="settingsStore.heroImages?.length > 1">
            <button
              v-for="(_, i) in settingsStore.heroImages"
              :key="i"
              :class="['hero__dot', { 'hero__dot--active': currentIndex === i }]"
              @click="currentIndex = i"
              :aria-label="`Imagen ${i + 1}`"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Categorías -->
    <section class="categories">
      <div class="section-container">
        <h2 class="section-title">Explora por categoría</h2>
        <div class="categories__grid">
          <RouterLink
            v-for="cat in categoriesStore.categories"
            :key="cat._id"
            :to="`/catalogo?category=${cat.name}`"
            class="category-chip"
          >
            {{ cat.name }}
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Productos destacados -->
    <section class="featured">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Productos destacados</h2>
          <RouterLink to="/catalogo" class="section-link">Ver todos →</RouterLink>
        </div>
        <div v-if="productsStore.loading" class="loading-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card"></div>
        </div>
        <div v-else class="products-grid">
          <ProductCard
            v-for="product in productsStore.products"
            :key="product._id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- CTA WhatsApp -->
    <section class="cta-whatsapp">
      <div class="cta-whatsapp__content">
        <h2>¿Tienes dudas sobre algún producto?</h2>
        <p>Escríbenos directamente y te respondemos al instante.</p>
        <a
          :href="`https://wa.me/${settingsStore.whatsappNumber}?text=${encodeURIComponent('Hola, tengo una consulta sobre sus productos.')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--whatsapp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Chatear ahora
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 88vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  gap: 40px;
  align-items: center;
}

@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 48px; }
  .hero__visual { order: -1; }
}

.hero__eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.hero__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1px;
  margin-bottom: 20px;
}

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 420px;
  line-height: 1.7;
  margin-bottom: 36px;
}

.hero__actions { display: flex; gap: 12px; flex-wrap: wrap; }

/* Carrusel */
.hero__visual { position: relative; }

.hero__image-wrapper {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.hero__image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: var(--radius-lg);
  display: block;
}

.hero__dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.hero__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0,0,0,0.25);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  padding: 0;
}

.hero__dot--active {
  background: var(--color-primary);
  transform: scale(1.3);
}

/* Transición fade */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.3s ease;
}

.hero-fade-enter-from,
.hero-fade-leave-to { opacity: 0; }

/* Botones */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
  border: none;
}

.btn--primary { background: var(--color-primary); color: white; }
.btn--primary:hover { background: var(--color-primary-hover); transform: translateY(-1px); box-shadow: var(--shadow-md); }

.btn--outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn--outline:hover { background: var(--color-primary); color: white; }

.btn--whatsapp { background: #25D366; color: white; font-size: 1rem; }
.btn--whatsapp:hover { background: #1ebe57; transform: translateY(-1px); box-shadow: var(--shadow-md); }

/* Sections */
.section-container { max-width: 1200px; margin: 0 auto; padding: 64px 24px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.section-title { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.5px; }
.section-link { color: var(--color-text-muted); text-decoration: none; font-weight: 500; transition: var(--transition); }
.section-link:hover { color: var(--color-primary); }

.categories { background: var(--color-surface); }
.categories__grid { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
.category-chip { padding: 10px 24px; border: 1.5px solid var(--color-border); border-radius: 999px; text-decoration: none; color: var(--color-text); font-weight: 500; transition: var(--transition); font-size: 0.9rem; }
.category-chip:hover { background: var(--color-primary); color: white; border-color: var(--color-primary); }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }

.skeleton-card {
  aspect-ratio: 0.85;
  border-radius: var(--radius-lg);
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.cta-whatsapp { background: var(--color-primary); color: white; text-align: center; padding: 80px 24px; }
.cta-whatsapp__content h2 { font-size: 2rem; font-weight: 700; margin-bottom: 12px; }
.cta-whatsapp__content p { color: rgba(255,255,255,0.75); font-size: 1.1rem; margin-bottom: 32px; }
</style>