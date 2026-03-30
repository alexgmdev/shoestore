import { useToastStore } from '@/stores/toast.store'

export function useToast() {
  const toastStore = useToastStore()
  return {
    success: (msg) => toastStore.success(msg),
    error: (msg) => toastStore.error(msg),
    info: (msg) => toastStore.info(msg)
  }
}