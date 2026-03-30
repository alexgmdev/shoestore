


<script setup>
import { useToast } from '@/composables/useToast'
import { ref, onMounted } from 'vue'
import api from '@/services/api'


const toast = useToast()
const products = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingProduct = ref(null)

const emptyForm = {
  name: '', description: '', price: '', category: '',
  sizes: [], stock: '', images: [''], isActive: true
}
const form = ref({ ...emptyForm })
const formError = ref('')
const saving = ref(false)

const categories = ['Urbano', 'Running', 'Botas', 'Casual']
const allSizes = ['36', '37', '38', '39', '40', '41', '42', '43']

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/products?limit=100&isActive=all')
    products.value = data.products
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingProduct.value = null
  form.value = { ...emptyForm, sizes: [], images: [''] }
  formError.value = ''
  showForm.value = true
}

const openEdit = (product) => {
  editingProduct.value = product
  form.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    sizes: [...product.sizes],
    stock: product.stock,
    images: [...product.images],
    isActive: product.isActive
  }
  formError.value = ''
  showForm.value = true
}

const toggleSize = (size) => {
  const idx = form.value.sizes.indexOf(size)
  if (idx === -1) form.value.sizes.push(size)
  else form.value.sizes.splice(idx, 1)
}

const saveProduct = async () => {
  formError.value = ''
  if (!form.value.name || !form.value.price || !form.value.category) {
    formError.value = 'Nombre, precio y categoría son requeridos'
    return
  }
  saving.value = true
  try {
    const payload = { ...form.value, price: Number(form.value.price), stock: Number(form.value.stock) }
    if (editingProduct.value) {
      await api.put(`/products/${editingProduct.value._id}`, payload)
      toast.success('Producto actualizado correctamente')
    } else {
      await api.post('/products', payload)
      toast.success('Producto creado correctamente')
    }
    showForm.value = false
    await fetchProducts()
  } catch (e) {
    toast.error(e.response?.data?.message || 'Error al guardar')
    formError.value = e.response?.data?.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}


const deleteProduct = async (id) => {
  if (!confirm('¿Desactivar este producto?')) return
  try {
    await api.delete(`/products/${id}`)
    toast.success('Producto desactivado')
    await fetchProducts()
  } catch {
    toast.error('Error al desactivar el producto')
  }
}

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price)

onMounted(fetchProducts)

const addImage = () => {
  if (form.value.images.length < 6) {
    form.value.images.push('')
  }
}

const removeImage = (index) => {
  if (form.value.images.length > 1) {
    form.value.images.splice(index, 1)
  }
}
</script>

<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h1 class="admin-section__title">Productos</h1>
      <button class="btn-primary" @click="openCreate">+ Nuevo producto</button>
    </div>

    <!-- Tabla -->
    <div class="table-wrapper">
      <table class="data-table" v-if="!loading">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>
              <img
                :src="product.images[0]"
                :alt="product.name"
                class="table-thumb"
              />
            </td>
            <td class="table-name">{{ product.name }}</td>
            <td><span class="badge">{{ product.category }}</span></td>
            <td>{{ formatPrice(product.price) }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <span :class="['status', product.isActive ? 'status--active' : 'status--inactive']">
                {{ product.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="table-actions">
              <button class="action-btn" @click="openEdit(product)">✏️</button>
              <button class="action-btn action-btn--danger" @click="deleteProduct(product._id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="loading-text">Cargando productos...</div>
    </div>

    <!-- Modal Form -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal">
        <div class="modal__header">
          <h2>{{ editingProduct ? 'Editar producto' : 'Nuevo producto' }}</h2>
          <button class="modal__close" @click="showForm = false" aria-label="Cerrar">✕</button>
        </div>

        <form @submit.prevent="saveProduct" class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input v-model="form.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Categoría *</label>
              <select v-model="form.category" class="form-input" required>
                <option value="">Seleccionar...</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.description" class="form-input form-textarea" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Precio (COP) *</label>
              <input v-model="form.price" type="number" class="form-input" min="0" required />
            </div>
            <div class="form-group">
              <label class="form-label">Stock</label>
              <input v-model="form.stock" type="number" class="form-input" min="0" />
            </div>
          </div>

          <div class="form-group">
  <label class="form-label">Imágenes (máx. 6)</label>

  <div
    v-for="(img, index) in form.images"
    :key="index"
    class="image-row"
  >
    <input
      v-model="form.images[index]"
      type="url"
      class="form-input"
      :placeholder="`URL imagen ${index + 1}`"
    />
    <!-- Preview miniatura -->
    <img
      v-if="form.images[index]"
      :src="form.images[index]"
      class="image-preview-thumb"
      alt="Preview"
      @error="$event.target.style.display='none'"
    />
    <!-- Botón eliminar -->
    <button
      type="button"
      class="btn-remove-img"
      @click="removeImage(index)"
      :disabled="form.images.length === 1"
      aria-label="Eliminar imagen"
    >
      ✕
    </button>
  </div>

  <!-- Botón agregar -->
  <button
    type="button"
    class="btn-add-img"
    @click="addImage"
    :disabled="form.images.length >= 6"
  >
    + Agregar imagen
  </button>
</div>

          <div class="form-group">
            <label class="form-label">Tallas disponibles</label>
            <div class="sizes-selector">
              <button
                v-for="size in allSizes"
                :key="size"
                type="button"
                :class="['size-btn', { 'size-btn--active': form.sizes.includes(size) }]"
                @click="toggleSize(size)"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="showForm = false">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar producto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-section { padding: 32px; }
.admin-section__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.admin-section__title { font-size: 1.75rem; font-weight: 700; }

.btn-primary { background: var(--color-primary); color: white; border: none; padding: 10px 20px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: var(--transition); }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: white; color: var(--color-text); border: 1.5px solid var(--color-border); padding: 10px 20px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: var(--transition); }
.btn-secondary:hover { border-color: var(--color-primary); }

.table-wrapper { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.data-table th, .data-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--color-border); }
.data-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted); background: #fafafa; }
.data-table tbody tr:hover { background: #fafafa; }

.table-thumb { width: 52px; height: 52px; object-fit: cover; border-radius: var(--radius-sm); background: #f0f0f0; }
.table-name { font-weight: 600; }
.table-actions { display: flex; gap: 8px; }

.badge { background: var(--color-background); padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 500; }
.status { padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
.status--active { background: #dcfce7; color: #166534; }
.status--inactive { background: #fee2e2; color: #991b1b; }

.action-btn { background: none; border: 1.5px solid var(--color-border); padding: 6px 10px; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition); font-size: 0.9rem; }
.action-btn:hover { border-color: var(--color-primary); }
.action-btn--danger:hover { border-color: var(--color-error); }

.loading-text { padding: 40px; text-align: center; color: var(--color-text-muted); }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
.modal { background: white; border-radius: var(--radius-lg); width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
.modal__header { display: flex; justify-content: space-between; align-items: center; padding: 24px 28px; border-bottom: 1px solid var(--color-border); }
.modal__header h2 { font-size: 1.2rem; font-weight: 700; }
.modal__close { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: var(--color-text-muted); padding: 4px; }

.product-form { padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--color-text-muted); }
.form-input { padding: 10px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.95rem; font-family: var(--font-sans); transition: var(--transition); }
.form-input:focus { outline: none; border-color: var(--color-primary); }
.form-textarea { resize: vertical; min-height: 80px; }
.form-error { color: var(--color-error); font-size: 0.875rem; background: #fef2f2; padding: 10px 14px; border-radius: var(--radius-sm); }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; }

.sizes-selector { display: flex; flex-wrap: wrap; gap: 8px; }
.size-btn { width: 44px; height: 44px; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); background: white; font-weight: 600; cursor: pointer; transition: var(--transition); }
.size-btn--active { background: var(--color-primary); color: white; border-color: var(--color-primary); }

.image-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.image-row .form-input {
  flex: 1;
}

.image-preview-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  flex-shrink: 0;
}

.btn-remove-img {
  background: none;
  border: 1.5px solid var(--color-border);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  transition: var(--transition);
  flex-shrink: 0;
}

.btn-remove-img:hover:not(:disabled) {
  border-color: var(--color-error);
  color: var(--color-error);
}

.btn-remove-img:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-add-img {
  background: none;
  border: 1.5px dashed var(--color-border);
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 600;
  transition: var(--transition);
  margin-top: 4px;
}

.btn-add-img:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-add-img:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>