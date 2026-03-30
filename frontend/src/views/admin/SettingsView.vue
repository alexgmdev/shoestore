<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings.store'
import { useToast } from '@/composables/useToast'

const settingsStore = useSettingsStore()
const toast = useToast()
const form = ref({ whatsappNumber: '', storeName: '', storeEmail: '', storeAddress: '',imageInicio: ''})
const saving = ref(false)

onMounted(() => {
  form.value = {
    whatsappNumber: settingsStore.whatsappNumber,
    storeName: settingsStore.storeName,
    storeEmail: settingsStore.storeEmail,
    storeAddress: settingsStore.storeAddress,
    imageInicio: settingsStore.imageInicio,
  }
})

const save = async () => {
  saving.value = true
  try {
    await settingsStore.updateSettings(form.value)
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
        <div class="form-group">
          <label class="form-label">URL de imagen de inicio</label>
          <input v-model="form.imageInicio" type="text" class="form-input" />
        </div>

        <div class="divider"></div>

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
.form-input { padding: 11px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.95rem; font-family: var(--font-sans); transition: var(--transition); }
.form-input:focus { outline: none; border-color: var(--color-primary); }
.form-hint { font-size: 0.8rem; color: var(--color-text-muted); }
.divider { border: none; border-top: 1px solid var(--color-border); }
.form-actions { display: flex; justify-content: flex-end; padding-top: 8px; }
.btn-primary { background: var(--color-primary); color: white; border: none; padding: 11px 24px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: var(--transition); }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>