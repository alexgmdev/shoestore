<script setup>
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
</script>

<template>
  <AppNavbar />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>