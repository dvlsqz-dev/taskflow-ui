<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { notifySuccess, notifyError } from '@/utils/notify'
import { extractFieldErrors, extractGeneralMessage } from '@/utils/errors'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const name = ref('')
const description = ref('')
const fieldErrors = ref({})

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    await projectsStore.fetchProject(route.params.id)
    // Precargar el formulario con los datos ya existentes
    name.value = projectsStore.currentProject.name
    description.value = projectsStore.currentProject.description
  } catch (error) {
    errorMessage.value = 'No se pudo cargar el proyecto'
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  fieldErrors.value = {}
  saving.value = true

  try {
    await projectsStore.updateProject(route.params.id, {
      name: name.value,
      description: description.value,
    })

    notifySuccess('Proyecto actualizado')
    router.push(`/projects/${route.params.id}`)
  } catch (error) {
    fieldErrors.value = extractFieldErrors(error)

    if (Object.keys(fieldErrors.value).length === 0) {
      errorMessage.value = extractGeneralMessage(error)
    }
    notifyError('No se pudo guardar el proyecto')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Editar Proyecto</h1>

    <p v-if="loading">Cargando...</p>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Nombre</label>
        <input
          v-model="name"
          type="text"
          required
          class="w-full border rounded px-3 py-2"
        />
        <p v-if="fieldErrors.name" class="text-red-600 text-sm">
          {{ fieldErrors.name }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          v-model="description"
          rows="4"
          class="w-full border rounded px-3 py-2"
        ></textarea>
        <p v-if="fieldErrors.description" class="text-red-600 text-sm">
          {{ fieldErrors.description }}
        </p>
      </div>

      <p v-if="errorMessage" class="text-red-600 text-sm">
        {{ errorMessage }}
      </p>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ saving ? 'Guardando...' : 'Guardar cambios' }}
        </button>

        <router-link
          :to="`/projects/${route.params.id}`"
          class="px-4 py-2 rounded border hover:bg-gray-50"
        >
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>