<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Variables reactivas para los campos del formulario
const email = ref('')
const password = ref('')

// Estado de la UI mientras se procesa el login
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.login(email.value, password.value)

    // Si venías de un guard (ej. /login?redirect=/dashboard), regresa ahí.
    // Si no, ve al dashboard por defecto.
    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = 'Correo o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Correo</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

      <p class="text-sm text-center mt-4">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-indigo-600 hover:underline">
          Regístrate
        </router-link>
      </p>
    </div>
  </div>
</template>