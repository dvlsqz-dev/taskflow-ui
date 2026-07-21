<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const { currentProject, loading, error } = storeToRefs(projectsStore)

onMounted(() => {
  projectsStore.fetchProject(route.params.id)
})

async function handleDelete() {
  const confirmed = confirm('¿Seguro que quieres eliminar este proyecto?')
  if (!confirmed) return

  try {
    await projectsStore.deleteProject(route.params.id)
    router.push('/projects')
  } catch (error) {
    alert('No se pudo eliminar el proyecto')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <router-link to="/projects" class="text-indigo-600 hover:underline text-sm">
      ← Volver a proyectos
    </router-link>

    <p v-if="loading" class="mt-4">Cargando...</p>
    <p v-else-if="error" class="mt-4 text-red-600">{{ error }}</p>

    <div v-else-if="currentProject" class="mt-4">
      <h1 class="text-2xl font-bold">{{ currentProject.name }}</h1>
      <p class="text-gray-600 mt-2">{{ currentProject.description }}</p>

      <div class="flex gap-3 mt-6">
        <router-link
          :to="`/projects/${currentProject.id}/edit`"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Editar
        </router-link>

        <button
          @click="handleDelete"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>