<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings.store'
import AppToast from '@/components/common/AppToast.vue'

const settingsStore = useSettingsStore()
onMounted(() => settingsStore.fetchSettings())
</script>

<template>
  <RouterView />
  <AppToast />
</template>