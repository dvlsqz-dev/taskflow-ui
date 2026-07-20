<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p>{{ authStore.user?.name }}</p>

    <button
      @click="handleLogout"
      class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  </div>
</template>