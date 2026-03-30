<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const users = ref([])
const loading = ref(false)

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/users')
    users.value = data
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (user) => {
  await api.put(`/users/${user._id}`, { ...user, isActive: !user.isActive })
  await fetchUsers()
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

onMounted(fetchUsers)
</script>

<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h1 class="admin-section__title">Usuarios</h1>
      <span class="count-badge">{{ users.length }} registrados</span>
    </div>

    <div class="table-wrapper">
      <table class="data-table" v-if="!loading">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Registrado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td class="table-name">{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['badge', user.role === 'admin' ? 'badge--admin' : '']">
                {{ user.role }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <span :class="['status', user.isActive ? 'status--active' : 'status--inactive']">
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button class="action-btn" @click="toggleStatus(user)">
                {{ user.isActive ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="loading-text">Cargando usuarios...</div>
    </div>
  </div>
</template>

<style scoped>
.admin-section { padding: 32px; }
.admin-section__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.admin-section__title { font-size: 1.75rem; font-weight: 700; }
.count-badge { background: var(--color-background); padding: 6px 14px; border-radius: 999px; font-size: 0.9rem; font-weight: 600; }
.table-wrapper { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 600px; }
.data-table th, .data-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--color-border); }
.data-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted); background: #fafafa; }
.data-table tbody tr:hover { background: #fafafa; }
.table-name { font-weight: 600; }
.badge { background: var(--color-background); padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 500; }
.badge--admin { background: #000; color: #fff; }
.status { padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
.status--active { background: #dcfce7; color: #166534; }
.status--inactive { background: #fee2e2; color: #991b1b; }
.action-btn { background: none; border: 1.5px solid var(--color-border); padding: 6px 12px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: var(--transition); }
.action-btn:hover { border-color: var(--color-primary); }
.loading-text { padding: 40px; text-align: center; color: var(--color-text-muted); }
</style>