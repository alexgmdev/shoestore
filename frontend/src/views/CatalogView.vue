<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products.store'
import { useCategoriesStore } from '@/stores/categories.store'
import ProductCard from '@/components/product/ProductCard.vue'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const filtersOpen = ref(false)

const filters = ref({
  category: route.query.category || '',
  minPrice: route.query.minPrice || '',
  maxPrice: route.query.maxPrice || '',
  size: route.query.size || '',
  search: route.query.search || '',
  page: 1
})

const sizes = ['36', '37', '38', '39', '40', '41', '42', '43']

const applyFilters = () => {
  filters.value.page = 1
  router.replace({ query: { ...filters.value } })
  productsStore.fetchProducts(filters.value)
}

const clearFilters = () => {
  filters.value = { category: '', minPrice: '', maxPrice: '', size: '', search: '', page: 1 }
  router.replace({ query: {} })
  productsStore.fetchProducts({})
}

const changePage = (page) => {
  filters.value.page = page
  productsStore.fetchProducts(filters.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleCategory = (catName) => {
  filters.value.category = filters.value.category === catName ? '' : catName
  applyFilters()
}

const toggleSize = (size) => {
  filters.value.size = filters.value.size === size ? '' : size
  applyFilters()
}

onMounted(async () => {
  await categoriesStore.fetchCategories()
  await productsStore.fetchProducts(filters.value)
})
</script>

<template>
  

  <div class="catalog">
    <div class="catalog__container">

      <!-- Toggle móvil -->
      <button class="filters-toggle" @click="filtersOpen = !filtersOpen">
        <span>🔧 Filtros{{ filters.category || filters.size || filters.minPrice || filters.maxPrice || filters.search ? ' (activos)' : '' }}</span>
        <span>{{ filtersOpen ? '▲' : '▼' }}</span>
      </button>

      <!-- Sidebar filtros -->
      <aside class="filters" :class="{ 'filters--open': filtersOpen }" aria-label="Filtros">
        <div class="filters__header">
          <h2 class="filters__title">Filtros</h2>
          <button class="filters__clear" @click="clearFilters">Limpiar todo</button>
        </div>

        <!-- Búsqueda -->
        <div class="filter-group">
          <label class="filter-label">Buscar</label>
          <input
            v-model="filters.search"
            type="search"
            placeholder="Nombre del producto..."
            class="filter-input"
            @input="applyFilters"
            aria-label="Buscar productos"
          />
        </div>

        <!-- Categorías dinámicas -->
        <div class="filter-group">
          <label class="filter-label">Categoría</label>
          <div v-if="categoriesStore.loading" class="filter-loading">Cargando...</div>
          <div v-else-if="categoriesStore.categories.length === 0" class="filter-empty">Sin categorías</div>
          <div v-else class="filter-options">
            <button
              v-for="cat in categoriesStore.categories"
              :key="cat._id"
              :class="['filter-chip', { 'filter-chip--active': filters.category === cat.name }]"
              @click="toggleCategory(cat.name)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Talla -->
        <div class="filter-group">
          <label class="filter-label">Talla</label>
          <div class="filter-options filter-options--sizes">
            <button
              v-for="size in sizes"
              :key="size"
              :class="['size-chip', { 'size-chip--active': filters.size === size }]"
              @click="toggleSize(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Precio -->
        <div class="filter-group">
          <label class="filter-label">Precio (COP)</label>
          <div class="price-range">
            <input
              v-model="filters.minPrice"
              type="number"
              placeholder="Mínimo"
              class="filter-input filter-input--half"
              @change="applyFilters"
              aria-label="Precio mínimo"
            />
            <input
              v-model="filters.maxPrice"
              type="number"
              placeholder="Máximo"
              class="filter-input filter-input--half"
              @change="applyFilters"
              aria-label="Precio máximo"
            />
          </div>
        </div>

        <!-- Filtros activos -->
        <div class="active-filters" v-if="filters.category || filters.size || filters.minPrice || filters.maxPrice || filters.search">
          <label class="filter-label">Filtros activos</label>
          <div class="active-filters__list">
            <span v-if="filters.category" class="active-tag">
              {{ filters.category }}
              <button @click="filters.category = ''; applyFilters()">✕</button>
            </span>
            <span v-if="filters.size" class="active-tag">
              Talla {{ filters.size }}
              <button @click="filters.size = ''; applyFilters()">✕</button>
            </span>
            <span v-if="filters.minPrice" class="active-tag">
              Desde ${{ Number(filters.minPrice).toLocaleString('es-CO') }}
              <button @click="filters.minPrice = ''; applyFilters()">✕</button>
            </span>
            <span v-if="filters.maxPrice" class="active-tag">
              Hasta ${{ Number(filters.maxPrice).toLocaleString('es-CO') }}
              <button @click="filters.maxPrice = ''; applyFilters()">✕</button>
            </span>
          </div>
        </div>
      </aside>

      <!-- Productos -->
      <section class="catalog__products">
        <div class="catalog__header">
          <h1 class="catalog__title">
            {{ filters.category ? filters.category : 'Todos los productos' }}
          </h1>
          <span class="catalog__count">{{ productsStore.total }} productos</span>
        </div>

        <div v-if="productsStore.loading" class="loading-grid">
          <div v-for="i in 9" :key="i" class="skeleton-card"></div>
        </div>

        <div v-else-if="productsStore.products.length === 0" class="empty-state">
          <p class="empty-state__icon">😕</p>
          <p class="empty-state__text">No encontramos productos con esos filtros.</p>
          <button class="btn-clear" @click="clearFilters">Limpiar filtros</button>
        </div>

        <div v-else class="products-grid">
          <ProductCard
            v-for="product in productsStore.products"
            :key="product._id"
            :product="product"
          />
        </div>

        <div v-if="productsStore.pages > 1" class="pagination">
          <button
            v-for="page in productsStore.pages"
            :key="page"
            :class="['page-btn', { 'page-btn--active': filters.page === page }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
      </section>
    </div>
  </div>

  
</template>

<style scoped>
.catalog { padding: 40px 0; }

.catalog__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;
}

/* Toggle móvil — oculto en desktop */
.filters-toggle {
  display: none;
}

/* Sidebar */
.filters {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  align-self: start;
  position: sticky;
  top: 80px;
}

.filters__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters__title { font-size: 1rem; font-weight: 700; }

.filters__clear {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  transition: var(--transition);
  font-family: var(--font-sans);
}

.filters__clear:hover { color: var(--color-primary); text-decoration: underline; }

.filter-group { margin-bottom: 24px; }

.filter-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--color-text-muted);
  margin-bottom: 10px;
}

.filter-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: var(--transition);
  font-family: var(--font-sans);
  box-sizing: border-box;
}

.filter-input:focus { border-color: var(--color-primary); outline: none; }

.filter-options { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-options--sizes { gap: 6px; }

.filter-chip {
  padding: 6px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-sans);
  font-weight: 500;
}

.filter-chip:hover { border-color: var(--color-primary); color: var(--color-primary); }
.filter-chip--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.size-chip {
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: white;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-sans);
}

.size-chip:hover { border-color: var(--color-primary); }
.size-chip--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.price-range { display: flex; gap: 8px; }
.filter-input--half { width: calc(50% - 4px); }

.filter-loading, .filter-empty {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  padding: 4px 0;
}

.active-filters { margin-top: -8px; }
.active-filters__list { display: flex; flex-wrap: wrap; gap: 6px; }

.active-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-background);
  border: 1.5px solid var(--color-border);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.active-tag button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  padding: 0;
  line-height: 1;
  transition: var(--transition);
}

.active-tag button:hover { color: var(--color-error); }

/* Productos */
.catalog__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 28px;
}

.catalog__title { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.5px; }
.catalog__count { color: var(--color-text-muted); font-size: 0.9rem; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

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

.empty-state { text-align: center; padding: 80px 24px; }
.empty-state__icon { font-size: 3rem; margin-bottom: 12px; }
.empty-state__text { color: var(--color-text-muted); margin-bottom: 20px; font-size: 1rem; }

.btn-clear {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: var(--transition);
}

.btn-clear:hover { background: var(--color-primary-hover); }

.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 48px;
  flex-wrap: wrap;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: white;
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: var(--transition);
}

.page-btn:hover { border-color: var(--color-primary); }
.page-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* ─── MÓVIL ─────────────────────────────── */
@media (max-width: 768px) {
  .catalog__container {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .filters-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 14px 20px;
    background: white;
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-sans);
    margin-bottom: 16px;
    box-sizing: border-box;
  }

  .filters {
    display: none;
    position: static;  /* ← quita el sticky en móvil */
    margin-bottom: 20px;
  }

  .filters--open {
    display: block;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>