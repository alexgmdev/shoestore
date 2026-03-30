<script setup>
import { ref, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories.store'
import { useToast } from '@/composables/useToast'
import api from '@/services/api'

const categoriesStore = useCategoriesStore()
const toast = useToast()

const newName = ref('')
const editingId = ref(null)
const editingName = ref('')
const saving = ref(false)

onMounted(() => categoriesStore.fetchAll())

const create = async () => {
  if (!newName.value.trim()) return
  saving.value = true
  try {
    await api.post('/categories', { name: newName.value.trim() })
    toast.success(`Categoría "${newName.value}" creada`)
    newName.value = ''
    await categoriesStore.fetchAll()
  } catch (e) {
    toast.error(e.response?.data?.message || 'Error al crear categoría')
  } finally {
    saving.value = false
  }
}

const startEdit = (category) => {
  editingId.value = category._id
  editingName.value = category.name
}

const saveEdit = async (id) => {
  if (!editingName.value.trim()) return
  try {
    await api.put(`/categories/${id}`, { name: editingName.value.trim() })
    toast.success('Categoría actualizada')
    editingId.value = null
    await categoriesStore.fetchAll()
  } catch (e) {
    toast.error(e.response?.data?.message || 'Error al actualizar')
  }
}

const cancelEdit = () => {
  editingId.value = null
  editingName.value = ''
}

const toggleActive = async (category) => {
  try {
    await api.put(`/categories/${category._id}`, { isActive: !category.isActive })
    toast.success(category.isActive ? 'Categoría desactivada' : 'Categoría activada')
    await categoriesStore.fetchAll()
  } catch {
    toast.error('Error al cambiar estado')
  }
}

const remove = async (category) => {
  if (!confirm(`¿Desactivar la categoría "${category.name}"?`)) return
  try {
    await api.delete(`/categories/${category._id}`)
    toast.success('Categoría desactivada')
    await categoriesStore.fetchAll()
  } catch {
    toast.error('Error al eliminar')
  }
}
</script>

<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h1 class="admin-section__title">Categorías</h1>
      <span class="count-badge">{{ categoriesStore.categories.length }} en total</span>
    </div>

    <!-- Crear nueva -->
    <div class="create-card">
      <h2 class="create-card__title">Nueva categoría</h2>
      <form @submit.prevent="create" class="create-form">
        <input
          v-model="newName"
          type="text"
          class="form-input"
          placeholder="Ej: Deportivo, Formal, Sandalias..."
          maxlength="40"
          required
        />
        <button type="submit" class="btn-primary" :disabled="saving || !newName.trim()">
          {{ saving ? 'Creando...' : '+ Agregar' }}
        </button>
      </form>
    </div>

    <!-- Lista de categorías -->
    <div class="categories-list">
      <div
        v-for="category in categoriesStore.categories"
        :key="category._id"
        :class="['category-item', { 'category-item--inactive': !category.isActive }]"
      >
        <!-- Modo edición -->
        <template v-if="editingId === category._id">
          <input
            v-model="editingName"
            class="form-input form-input--inline"
            @keydown.enter="saveEdit(category._id)"
            @keydown.esc="cancelEdit"
            autofocus
          />
          <div class="category-item__actions">
            <button class="btn-action btn-action--save" @click="saveEdit(category._id)">
              ✓ Guardar
            </button>
            <button class="btn-action btn-action--cancel" @click="cancelEdit">
              ✕ Cancelar
            </button>
          </div>
        </template>

        <!-- Modo visualización -->
        <template v-else>
          <div class="category-item__left">
            <span class="drag-handle">⠿</span>
            <span class="category-item__name">{{ category.name }}</span>
            <span
              :class="['status-dot', category.isActive ? 'status-dot--active' : 'status-dot--inactive']"
            ></span>
          </div>
          <div class="category-item__actions">
            <button
              class="btn-action btn-action--edit"
              @click="startEdit(category)"
              aria-label="Editar"
            >
              ✏️ Editar
            </button>
            <button
              class="btn-action"
              @click="toggleActive(category)"
              :aria-label="category.isActive ? 'Desactivar' : 'Activar'"
            >
              {{ category.isActive ? '🔒 Desactivar' : '✅ Activar' }}
            </button>
          </div>
        </template>
      </div>

      <div v-if="categoriesStore.categories.length === 0" class="empty-state">
        No hay categorías. ¡Crea la primera!
      </div>
    </div>

    <!-- Info -->
    <div class="info-box">
      <p>💡 <strong>Las categorías desactivadas</strong> no aparecen en el catálogo ni en los filtros.</p>
      <p>💡 <strong>Al crear un producto</strong>, solo verás las categorías activas en el formulario.</p>
    </div>
  </div>
</template>

<style scoped>
.admin-section { padding: 32px; }
.admin-section__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.admin-section__title { font-size: 1.75rem; font-weight: 700; }
.count-badge { background: var(--color-background); padding: 6px 14px; border-radius: 999px; font-size: 0.9rem; font-weight: 600; }

/* Crear */
.create-card { background: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); margin-bottom: 24px; }
.create-card__title { font-size: 1rem; font-weight: 700; margin-bottom: 16px; }
.create-form { display: flex; gap: 12px; }
.create-form .form-input { flex: 1; }

.form-input { padding: 11px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.95rem; font-family: var(--font-sans); transition: var(--transition); }
.form-input:focus { outline: none; border-color: var(--color-primary); }
.form-input--inline { flex: 1; }

.btn-primary { background: var(--color-primary); color: white; border: none; padding: 11px 20px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: var(--transition); white-space: nowrap; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

/* Lista */
.categories-list { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 20px; }

.category-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--color-border); gap: 12px; transition: var(--transition); }
.category-item:last-child { border-bottom: none; }
.category-item:hover { background: #fafafa; }
.category-item--inactive { opacity: 0.5; }

.category-item__left { display: flex; align-items: center; gap: 12px; flex: 1; }

.drag-handle { color: var(--color-text-muted); font-size: 1.1rem; cursor: grab; user-select: none; }

.category-item__name { font-weight: 600; font-size: 0.95rem; }

.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.status-dot--active { background: #22c55e; }
.status-dot--inactive { background: #d1d5db; }

.category-item__actions { display: flex; gap: 8px; flex-shrink: 0; }

.btn-action { background: none; border: 1.5px solid var(--color-border); padding: 6px 12px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; font-weight: 500; transition: var(--transition); white-space: nowrap; }
.btn-action:hover { border-color: var(--color-primary); }
.btn-action--edit:hover { border-color: #3b82f6; }
.btn-action--save { border-color: #22c55e; color: #166534; }
.btn-action--save:hover { background: #dcfce7; }
.btn-action--cancel { border-color: var(--color-error); color: var(--color-error); }
.btn-action--cancel:hover { background: #fee2e2; }

.empty-state { padding: 48px; text-align: center; color: var(--color-text-muted); }

/* Info */
.info-box { background: #f8f8f8; border-radius: var(--radius-md); padding: 16px 20px; display: flex; flex-direction: column; gap: 6px; }
.info-box p { font-size: 0.875rem; color: var(--color-text-muted); }
</style>