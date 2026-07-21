<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'

const router = useRouter()
const projectsStore = useProjectsStore()

const name = ref('')
const description = ref('')

const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    await projectsStore.createProject({
      name: name.value,
      description: description.value,
    })

    router.push('/projects')
  } catch (error) {
    errorMessage.value = 'No se pudo crear el proyecto. Verifica los datos.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Nuevo Proyecto</h1>

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
        <label class="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          v-model="description"
          rows="4"
          class="w-full border rounded px-3 py-2"
        ></textarea>
      </div>

      <p v-if="errorMessage" class="text-red-600 text-sm">
        {{ errorMessage }}
      </p>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="loading"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Crear proyecto' }}
        </button>

        <router-link
          to="/projects"
          class="px-4 py-2 rounded border hover:bg-gray-50"
        >
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>