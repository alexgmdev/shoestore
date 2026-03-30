<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products.store'
import { useToast } from '@/composables/useToast'
import WhatsAppButton from '@/components/product/WhatsAppButton.vue'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const toast = useToast()

const selectedSize = ref(null)
const selectedImage = ref(0)
const sizeError = ref(false)

// Cargar producto cuando cambia el slug
const loadProduct = async () => {
  selectedSize.value = null
  selectedImage.value = 0
  try {
    await productsStore.fetchProduct(route.params.slug)
    // Cargar relacionados
    if (productsStore.currentProduct) {
      await productsStore.fetchProducts({
        category: productsStore.currentProduct.category,
        limit: 4
      })
    }
  } catch {
    toast.error('Producto no encontrado')
    router.push('/catalogo')
  }
}

onMounted(loadProduct)
watch(() => route.params.slug, loadProduct)

const relatedProducts = computed(() =>
  productsStore.products.filter(p => p._id !== productsStore.currentProduct?._id).slice(0, 3)
)

const selectSize = (size) => {
  selectedSize.value = size
  sizeError.value = false
}

const formattedPrice = computed(() => {
  if (!productsStore.currentProduct) return ''
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(productsStore.currentProduct.price)
})
</script>

<template>
  

  <div class="detail-page" v-if="productsStore.currentProduct && !productsStore.loading">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb__list">
        <li><RouterLink to="/">Inicio</RouterLink></li>
        <li aria-hidden="true">›</li>
        <li><RouterLink to="/catalogo">Catálogo</RouterLink></li>
        <li aria-hidden="true">›</li>
        <li aria-current="page">{{ productsStore.currentProduct.name }}</li>
      </ol>
    </nav>

    <!-- Producto principal -->
    <div class="product-detail">
      <!-- Galería -->
      <div class="product-detail__gallery">
        <div class="gallery__main">
          <img
            :src="productsStore.currentProduct.images[selectedImage]"
            :alt="productsStore.currentProduct.name"
            class="gallery__main-image"
          />
        </div>
        <div
          class="gallery__thumbnails"
          v-if="productsStore.currentProduct.images.length > 1"
        >
          <button
            v-for="(img, i) in productsStore.currentProduct.images"
            :key="i"
            :class="['gallery__thumb-btn', { 'gallery__thumb-btn--active': selectedImage === i }]"
            @click="selectedImage = i"
            :aria-label="`Ver imagen ${i + 1}`"
          >
            <img :src="img" :alt="`Imagen ${i + 1}`" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="product-detail__info">
        <span class="product-detail__category">{{ productsStore.currentProduct.category }}</span>
        <h1 class="product-detail__name">{{ productsStore.currentProduct.name }}</h1>
        <p class="product-detail__price">{{ formattedPrice }}</p>

        <div class="product-detail__divider"></div>

        <p class="product-detail__description">
          {{ productsStore.currentProduct.description }}
        </p>

        <!-- Selector de talla -->
        <div
          class="size-selector"
          v-if="productsStore.currentProduct.sizes?.length"
        >
          <div class="size-selector__header">
            <label class="size-selector__label">Selecciona tu talla</label>
            <span v-if="sizeError" class="size-selector__error">⚠️ Selecciona una talla</span>
          </div>
          <div class="size-selector__options">
            <button
              v-for="size in productsStore.currentProduct.sizes"
              :key="size"
              :class="['size-btn', { 'size-btn--active': selectedSize === size }]"
              @click="selectSize(size)"
              :aria-pressed="selectedSize === size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Stock -->
        <p class="stock-info" v-if="productsStore.currentProduct.stock > 0">
          <span class="stock-dot"></span>
          {{ productsStore.currentProduct.stock }} unidades disponibles
        </p>
        <p class="stock-info stock-info--out" v-else>
          Sin stock disponible
        </p>

        <!-- WhatsApp -->
        <WhatsAppButton
          :product="productsStore.currentProduct"
          :selected-size="selectedSize"
          @need-size="sizeError = true"
        />

        <!-- Métricas visibles -->
        <p class="product-detail__views">
          👁 {{ productsStore.currentProduct.views }} personas vieron este producto
        </p>
      </div>
    </div>

    <!-- Productos relacionados -->
    <section class="related" v-if="relatedProducts.length">
      <h2 class="related__title">También te puede interesar</h2>
      <div class="related__grid">
        <article
          v-for="product in relatedProducts"
          :key="product._id"
          class="related-card"
          @click="router.push(`/producto/${product.slug}`)"
          role="button"
          :aria-label="`Ver ${product.name}`"
          tabindex="0"
          @keydown.enter="router.push(`/producto/${product.slug}`)"
        >
          <div class="related-card__img-wrapper">
            <img
              :src="product.images[0]"
              :alt="product.name"
              loading="lazy"
            />
          </div>
          <div class="related-card__info">
            <p class="related-card__name">{{ product.name }}</p>
            <p class="related-card__price">
              {{
                new Intl.NumberFormat('es-CO', {
                  style: 'currency', currency: 'COP', maximumFractionDigits: 0
                }).format(product.price)
              }}
            </p>
          </div>
        </article>
      </div>
    </section>
  </div>

  <!-- Skeleton loader -->
  <div v-else class="detail-skeleton">
    <div class="skeleton skeleton--image"></div>
    <div class="skeleton-info">
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--price"></div>
      <div class="skeleton skeleton--text"></div>
      <div class="skeleton skeleton--text short"></div>
    </div>
  </div>

  
</template>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 64px;
}

/* Breadcrumb */
.breadcrumb { margin-bottom: 32px; }
.breadcrumb__list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  flex-wrap: wrap;
}
.breadcrumb__list a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: var(--transition);
}
.breadcrumb__list a:hover { color: var(--color-primary); }
.breadcrumb__list li:last-child { color: var(--color-text); font-weight: 500; }

/* Layout producto */
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  margin-bottom: 80px;
}

@media (max-width: 768px) {
  .product-detail { grid-template-columns: 1fr; gap: 32px; }
}

/* Galería */
.gallery__main {
  background: #f5f5f5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 1;
}

.gallery__main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery__main-image:hover { transform: scale(1.03); }

.gallery__thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.gallery__thumb-btn {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  background: #f5f5f5;
  transition: var(--transition);
  flex-shrink: 0;
}

.gallery__thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__thumb-btn--active,
.gallery__thumb-btn:hover {
  border-color: var(--color-primary);
}

/* Info */
.product-detail__category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-text-muted);
  font-weight: 600;
}

.product-detail__name {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 8px 0 16px;
  line-height: 1.2;
}

.product-detail__price {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.product-detail__divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin-bottom: 20px;
}

.product-detail__description {
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 28px;
  font-size: 0.975rem;
}

/* Tallas */
.size-selector { margin-bottom: 24px; }

.size-selector__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.size-selector__label { font-size: 0.875rem; font-weight: 700; }

.size-selector__error {
  font-size: 0.8rem;
  color: var(--color-error);
  font-weight: 500;
}

.size-selector__options { display: flex; flex-wrap: wrap; gap: 8px; }

.size-btn {
  width: 52px;
  height: 52px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: white;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.875rem;
  transition: var(--transition);
}

.size-btn:hover { border-color: var(--color-primary); }

.size-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Stock */
.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #166534;
  font-weight: 500;
  margin-bottom: 20px;
}

.stock-info--out { color: var(--color-error); }

.stock-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  flex-shrink: 0;
}

.product-detail__views {
  margin-top: 16px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* Relacionados */
.related__title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.3px;
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.related-card {
  cursor: pointer;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: white;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.related-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.related-card__img-wrapper {
  aspect-ratio: 1;
  overflow: hidden;
  background: #f5f5f5;
}

.related-card__img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .related-card__img-wrapper img {
  transform: scale(1.05);
}

.related-card__info { padding: 14px 16px; }

.related-card__name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-card__price {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-primary);
}

/* Skeleton */
.detail-skeleton {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
}

@media (max-width: 768px) {
  .detail-skeleton { grid-template-columns: 1fr; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

.skeleton--image { aspect-ratio: 1; width: 100%; }
.skeleton-info { display: flex; flex-direction: column; gap: 16px; padding-top: 16px; }
.skeleton--title { height: 48px; width: 80%; }
.skeleton--price { height: 36px; width: 40%; }
.skeleton--text { height: 16px; width: 100%; }
.skeleton--text.short { width: 60%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>