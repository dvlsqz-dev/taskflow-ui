<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()
const { projects, loading, error } = storeToRefs(projectsStore)

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mis Proyectos</h1>
      <router-link
        to="/projects/create"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        + Nuevo Proyecto
      </router-link>
    </div>

    <p v-if="loading">Cargando proyectos...</p>

    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <p v-else-if="projects.length === 0" class="text-gray-500">
      No tienes proyectos todavía.
    </p>

    <ul v-else class="space-y-3">
      <li
        v-for="project in projects"
        :key="project.id"
        class="border rounded-lg hover:shadow-md transition"
      >
        <router-link :to="`/projects/${project.id}`" class="block p-4">
          <h2 class="font-semibold text-lg">{{ project.name }}</h2>
          <p class="text-gray-600 text-sm">{{ project.description }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>