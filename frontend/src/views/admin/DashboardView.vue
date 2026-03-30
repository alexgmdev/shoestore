<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title
} from 'chart.js'
import api from '@/services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title)

const metrics = ref({
  totalProducts: 0,
  totalUsers: 0,
  totalLeads: 0,
  topProducts: [],
  categoryDistribution: {}
})
const loading = ref(true)

onMounted(async () => {
  try {
    const [productsRes, usersRes, leadsRes] = await Promise.all([
      api.get('/products?limit=100'),
      api.get('/users'),
      api.get('/leads')
    ])

    const products = productsRes.data.products
    const users = usersRes.data
    const leads = leadsRes.data

    // Distribución por categoría
    const categoryDist = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {})

    metrics.value = {
      totalProducts: productsRes.data.total,
      totalUsers: users.length,
      totalLeads: leads.total || leads.leads?.length || 0,
      topProducts: [...products]
        .sort((a, b) => b.whatsappClicks - a.whatsappClicks)
        .slice(0, 6),
      categoryDistribution: categoryDist
    }
  } finally {
    loading.value = false
  }
})

// Chart — Top productos (barras)
const barChartData = computed(() => ({
  labels: metrics.value.topProducts.map(p =>
    p.name.length > 16 ? p.name.substring(0, 16) + '…' : p.name
  ),
  datasets: [
    {
      label: 'Clics WhatsApp',
      data: metrics.value.topProducts.map(p => p.whatsappClicks),
      backgroundColor: '#000000',
      borderRadius: 6,
      borderSkipped: false
    },
    {
      label: 'Vistas',
      data: metrics.value.topProducts.map(p => p.views),
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
      grid: { color: '#f0f0f0' }
    },
    x: {
      grid: { display: false }
    }
  }
}

// Chart — Categorías (dona)
const doughnutData = computed(() => ({
  labels: Object.keys(metrics.value.categoryDistribution),
  datasets: [{
    data: Object.values(metrics.value.categoryDistribution),
    backgroundColor: ['#000000', '#404040', '#808080', '#b0b0b0', '#d0d0d0'],
    borderWidth: 0,
    hoverOffset: 8
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  },
  cutout: '65%'
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Dashboard</h1>

    <div v-if="loading" class="dashboard__loading">Cargando métricas...</div>

    <template v-else>
      <!-- Métricas principales -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-card__icon">👟</div>
          <div>
            <p class="metric-card__label">Productos activos</p>
            <p class="metric-card__value">{{ metrics.totalProducts }}</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-card__icon">👥</div>
          <div>
            <p class="metric-card__label">Usuarios registrados</p>
            <p class="metric-card__value">{{ metrics.totalUsers }}</p>
          </div>
        </div>
        <div class="metric-card metric-card--whatsapp">
          <div class="metric-card__icon">💬</div>
          <div>
            <p class="metric-card__label">Leads WhatsApp</p>
            <p class="metric-card__value">{{ metrics.totalLeads }}</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-card__icon">📦</div>
          <div>
            <p class="metric-card__label">Categorías</p>
            <p class="metric-card__value">{{ Object.keys(metrics.categoryDistribution).length }}</p>
          </div>
        </div>
      </div>

      <!-- Gráficas -->
      <div class="charts-grid">
        <div class="chart-card chart-card--wide">
          <h2 class="chart-card__title">Rendimiento de productos</h2>
          <p class="chart-card__subtitle">Vistas vs clics en WhatsApp</p>
          <div class="chart-wrapper">
            <Bar :data="barChartData" :options="barChartOptions" />
          </div>
        </div>

        <div class="chart-card">
          <h2 class="chart-card__title">Distribución por categoría</h2>
          <p class="chart-card__subtitle">Productos por categoría</p>
          <div class="chart-wrapper chart-wrapper--doughnut">
            <Doughnut :data="doughnutData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <!-- Tabla top productos -->
      <div class="top-table">
        <h2 class="top-table__title">Top productos — Clics WhatsApp</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Vistas</th>
              <th>Clics WA</th>
              <th>Conversión</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in metrics.topProducts" :key="product._id">
              <td class="rank">{{ index + 1 }}</td>
              <td>
                <div class="product-cell">
                  <img :src="product.images[0]" :alt="product.name" class="product-thumb" />
                  <span class="product-name">{{ product.name }}</span>
                </div>
              </td>
              <td><span class="badge">{{ product.category }}</span></td>
              <td>
                {{
                  new Intl.NumberFormat('es-CO', {
                    style: 'currency', currency: 'COP', maximumFractionDigits: 0
                  }).format(product.price)
                }}
              </td>
              <td>{{ product.views }}</td>
              <td>
                <span class="clicks-badge">{{ product.whatsappClicks }}</span>
              </td>
              <td>
                <span class="conversion">
                  {{
                    product.views > 0
                      ? ((product.whatsappClicks / product.views) * 100).toFixed(1) + '%'
                      : '—'
                  }}
                </span>
              </td>
            </tr>
            <tr v-if="metrics.topProducts.length === 0">
              <td colspan="7" class="empty-row">Sin datos aún</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard { padding: 32px; }
.dashboard__title { font-size: 1.75rem; font-weight: 700; margin-bottom: 32px; }
.dashboard__loading { padding: 80px; text-align: center; color: var(--color-text-muted); }

/* Métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition);
}

.metric-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.metric-card--whatsapp { border-left: 4px solid #25D366; }

.metric-card__icon { font-size: 2rem; }
.metric-card__label { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.metric-card__value { font-size: 2rem; font-weight: 800; line-height: 1; }

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

@media (max-width: 900px) {
  .charts-grid { grid-template-columns: 1fr; }
}

.chart-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.chart-card__title { font-size: 1rem; font-weight: 700; margin-bottom: 2px; }
.chart-card__subtitle { font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 20px; }

.chart-wrapper { height: 260px; }
.chart-wrapper--doughnut { height: 240px; display: flex; align-items: center; justify-content: center; }

/* Tabla */
.top-table { background: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); }
.top-table__title { font-size: 1rem; font-weight: 700; margin-bottom: 20px; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--color-border); }
.data-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted); }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #fafafa; }

.rank { font-weight: 700; color: var(--color-text-muted); width: 32px; }

.product-cell { display: flex; align-items: center; gap: 12px; }
.product-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: var(--radius-sm); background: #f0f0f0; flex-shrink: 0; }
.product-name { font-weight: 600; font-size: 0.9rem; }

.badge { background: var(--color-background); padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 500; }

.clicks-badge {
  background: #dcfce7;
  color: #166534;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.conversion { font-size: 0.875rem; font-weight: 600; color: var(--color-text-muted); }
.empty-row { text-align: center; color: var(--color-text-muted); padding: 40px; }
</style>