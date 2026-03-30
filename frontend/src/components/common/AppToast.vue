<script setup>
import { useToastStore } from '@/stores/toast.store'

const toastStore = useToastStore()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.type}`]"
          role="alert"
        >
          <span class="toast__icon">
            {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close" @click="toastStore.remove(toast.id)" aria-label="Cerrar">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
  width: calc(100vw - 48px);
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: white;
  box-shadow: var(--shadow-lg);
  border-left: 4px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
}

.toast--success { border-left-color: #22c55e; }
.toast--error   { border-left-color: var(--color-error); }
.toast--info    { border-left-color: #3b82f6; }

.toast__icon { font-size: 1rem; flex-shrink: 0; }
.toast__message { flex: 1; line-height: 1.4; }

.toast__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  padding: 2px;
  flex-shrink: 0;
  transition: var(--transition);
}
.toast__close:hover { color: var(--color-text); }

/* Animaciones */
.toast-enter-active { animation: slideIn 0.25s ease; }
.toast-leave-active { animation: slideOut 0.2s ease forwards; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slideOut {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(100%); }
}
</style>