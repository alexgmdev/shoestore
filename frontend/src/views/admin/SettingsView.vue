<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings.store'
import { useToast } from '@/composables/useToast'

const settingsStore = useSettingsStore()
const toast = useToast()

const form = ref({
  whatsappNumber: '',
  storeName: '',
  storeEmail: '',
  storeAddress: '',
  heroImages: ['']
})
const saving = ref(false)

onMounted(() => {
  form.value = {
    whatsappNumber: settingsStore.whatsappNumber,
    storeName: settingsStore.storeName,
    storeEmail: settingsStore.storeEmail,
    storeAddress: settingsStore.storeAddress,
    heroImages: settingsStore.heroImages?.length
      ? [...settingsStore.heroImages]
      : [settingsStore.imageInicio || '']
  }
})

const save = async () => {
  saving.value = true
  try {
    // filtra URLs vacías antes de guardar
    const payload = {
      ...form.value,
      heroImages: form.value.heroImages.filter(url => url.trim() !== '')
    }
    await settingsStore.updateSettings(payload)
    toast.success('Configuración guardada correctamente')
  } catch {
    toast.error('Error al guardar la configuración')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-section">
    <h1 class="admin-section__title">Configuración</h1>

    <div class="settings-card">
      <form @submit.prevent="save" class="settings-form">

        <!-- Datos tienda -->
        <h2 class="settings-section-title">🛒 Datos de la tienda</h2>
        <div class="form-group">
          <label class="form-label">Nombre de la tienda</label>
          <input v-model="form.storeName" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Email de contacto</label>
          <input v-model="form.storeEmail" type="email" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Dirección</label>
          <input v-model="form.storeAddress" type="text" class="form-input" />
        </div>

        <div class="divider"></div>

        <!-- Imágenes Hero -->
        <h2 class="settings-section-title">🖼️ Imágenes del Hero</h2>
        <p class="form-hint">Agrega hasta 5 imágenes — rotan automáticamente cada 4 segundos.</p>

        <div
          v-for="(img, index) in form.heroImages"
          :key="index"
          class="image-row"
        >
          <input
            v-model="form.heroImages[index]"
            type="url"
            class="form-input"
            :placeholder="`URL imagen ${index + 1}`"
          />
          <img
            v-if="form.heroImages[index]"
            :src="form.heroImages[index]"
            class="image-preview-thumb"
            alt="Preview"
            @error="$event.target.style.display='none'"
          />
          <button
            type="button"
            class="btn-remove-img"
            @click="form.heroImages.splice(index, 1)"
            :disabled="form.heroImages.length === 1"
            aria-label="Eliminar imagen"
          >✕</button>
        </div>

        <button
          type="button"
          class="btn-add-img"
          @click="form.heroImages.push('')"
          :disabled="form.heroImages.length >= 5"
        >
          + Agregar imagen
        </button>

        <div class="divider"></div>

        <!-- WhatsApp -->
        <h2 class="settings-section-title">📱 WhatsApp</h2>
        <div class="form-group">
          <label class="form-label">Número de WhatsApp</label>
          <input v-model="form.whatsappNumber" type="text" class="form-input" placeholder="573001234567" />
          <p class="form-hint">Formato internacional sin +, espacios ni guiones. Ej: 573001234567</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.admin-section { padding: 32px; }
.admin-section__title { font-size: 1.75rem; font-weight: 700; margin-bottom: 28px; }
.settings-card { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: 32px; max-width: 560px; }
.settings-form { display: flex; flex-direction: column; gap: 20px; }
.settings-section-title { font-size: 1rem; font-weight: 700; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--color-text-muted); }
.form-input { padding: 11px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.95rem; font-family: var(--font-sans); transition: var(--transition); width: 100%; box-sizing: border-box; }
.form-input:focus { outline: none; border-color: var(--color-primary); }
.form-hint { font-size: 0.8rem; color: var(--color-text-muted); }
.divider { border: none; border-top: 1px solid var(--color-border); }

/* Imágenes */
.image-row { display: flex; align-items: center; gap: 10px; }
.image-row .form-input { flex: 1; width: auto; }

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

.btn-remove-img:hover:not(:disabled) { border-color: var(--color-error); color: var(--color-error); }
.btn-remove-img:disabled { opacity: 0.3; cursor: not-allowed; }

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
  font-family: var(--font-sans);
}

.btn-add-img:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
.btn-add-img:disabled { opacity: 0.4; cursor: not-allowed; }

.form-actions { display: flex; justify-content: flex-end; padding-top: 8px; }
.btn-primary { background: var(--color-primary); color: white; border: none; padding: 11px 24px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: var(--transition); font-family: var(--font-sans); }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>