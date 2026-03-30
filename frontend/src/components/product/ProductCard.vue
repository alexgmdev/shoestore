<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()

const formattedPrice = computed(() =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(props.product.price)
)

const goToDetail = () => router.push(`/producto/${props.product.slug}`)
</script>

<template>
  <article
    class="product-card"
    @click="goToDetail"
    role="button"
    :aria-label="`Ver ${product.name}`"
    tabindex="0"
    @keydown.enter="goToDetail"
  >
    <div class="product-card__image-wrapper">
      <img
        :src="product.images[0] || '/placeholder-shoe.jpg'"
        :alt="product.name"
        class="product-card__image"
        loading="lazy"
      />
      <div class="product-card__overlay">
        <span class="product-card__cta">Ver producto</span>
      </div>
    </div>
    <div class="product-card__info">
      <span class="product-card__category">{{ product.category }}</span>
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__price">{{ formattedPrice }}</p>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.product-card__image-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f0f0f0;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.product-card:hover .product-card__overlay { opacity: 1; }

.product-card__cta {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.product-card__info {
  padding: 16px;
}

.product-card__category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

.product-card__name {
  font-size: 1rem;
  font-weight: 600;
  margin: 4px 0 8px;
  color: var(--color-text);
}

.product-card__price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
}
</style>