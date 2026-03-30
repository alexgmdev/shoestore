import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const routes = [
  // ── CON Navbar + Footer ──────────────────────────
  {
    path: '/',
    component: () => import('@/views/layouts/PublicLayout.vue'),
    children: [
      { path: '', component: () => import('@/views/HomeView.vue') },
      { path: 'catalogo', component: () => import('@/views/CatalogView.vue') },
      { path: 'producto/:slug', component: () => import('@/views/ProductDetailView.vue') },
      // Agrega aquí cualquier vista donde quieras navbar
    ]
  },

  // ── SIN Navbar (blank) ───────────────────────────
  {
    path: '/',
    component: () => import('@/views/layouts/BlankLayout.vue'),
    children: [
      { path: 'login', component: () => import('@/views/LoginView.vue') },
      { path: 'registro', component: () => import('@/views/RegisterView.vue') },
    ]
  },

  // ── Admin (su propio layout con sidebar) ─────────
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      { path: '', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'productos', component: () => import('@/views/admin/ProductsView.vue') },
      { path: 'usuarios', component: () => import('@/views/admin/UsersView.vue') },
      { path: 'configuracion', component: () => import('@/views/admin/SettingsView.vue') },
      { path: 'categorias', component: () => import('@/views/admin/CategoriesView.vue') }
    ]
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    next('/login')
  } else {
    next()
  }
})

export default router