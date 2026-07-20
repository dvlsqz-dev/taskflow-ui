<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Variables reactivas para los campos del formulario
const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

// Estado de la UI mientras se procesa el login
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value, password_confirmation: password_confirmation.value })

    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = 'Contraseña no coincide o correo ya registrado'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">Registrarse</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nombre</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full border rounded px-3 py-2"
          />
        </div>

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

        <div>
          <label class="block text-sm font-medium mb-1">Confirmar Contraseña</label>
          <input
            v-model="password_confirmation"
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
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <p class="text-sm text-center mt-4">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-indigo-600 hover:underline">
          Inicia sesión
        </router-link>
      </p>
    </div>
  </div>
</template>