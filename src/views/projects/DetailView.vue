<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { confirmAction, notifySuccess, notifyError } from '@/utils/notify'

const route = useRoute()
const router = useRouter()

const projectsStore = useProjectsStore()
const { currentProject, loading, error } = storeToRefs(projectsStore)

const tasksStore = useTasksStore()
const { tasks, loading: tasksLoading, error: tasksError } = storeToRefs(tasksStore)

onMounted(() => {
  projectsStore.fetchProject(route.params.id)
  tasksStore.fetchTasks(route.params.id)
})

async function handleDeleteProject() {
  const confirmed = await confirmAction('¿Seguro que quieres eliminar este proyecto?')
  if (!confirmed) return

  try {
    await projectsStore.deleteProject(route.params.id)
    notifySuccess('Proyecto eliminado')
    router.push('/projects')
  } catch (error) {
    notifyError('No se pudo eliminar el proyecto')
  }
}

// --- Lógica del modal de tareas ---
const showModal = ref(false)
const editingTask = ref(null) // null = creando, objeto = editando

const taskTitle = ref('')
const taskDescription = ref('')
const taskStatus = ref('')
const taskDateLimit = ref('')
const savingTask = ref(false)
const taskError = ref('')

function openCreateModal() {
  editingTask.value = null
  taskTitle.value = ''
  taskDescription.value = ''
  taskStatus.value = ''
  taskDateLimit.value = ''
  taskError.value = ''
  showModal.value = true
}

function openEditModal(task) {
  editingTask.value = task
  taskTitle.value = task.title
  taskDescription.value = task.description
  taskStatus.value = task.status
  taskDateLimit.value = task.date_limit
  taskError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleTaskSubmit() {
  taskError.value = ''
  savingTask.value = true

  try {
    const data = { title: taskTitle.value, description: taskDescription.value, status: taskStatus.value, date_limit: taskDateLimit.value }

    if (editingTask.value) {
      await tasksStore.updateTask(route.params.id, editingTask.value.id, data)
      notifySuccess('Tarea actualizada')
    } else {
      await tasksStore.createTask(route.params.id, data)
      notifySuccess('Tarea creada')
    }

    closeModal()
  } catch (error) {
    taskError.value = 'No se pudo guardar la tarea'
    notifyError('No se pudo guardar la tarea')
  } finally {
    savingTask.value = false
  }
}

async function handleDeleteTask(taskId) {
  const confirmed = await confirmAction('¿Eliminar esta tarea?')
  if (!confirmed) return

  try {
    await tasksStore.deleteTask(route.params.id, taskId)
    notifySuccess('Tarea eliminada')
  } catch (error) {
    notifyError('No se pudo eliminar la tarea')
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
          @click="handleDeleteProject"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>

      <!-- Sección de tareas -->
      <div class="mt-10">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Tareas</h2>
          <button
            @click="openCreateModal"
            class="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
          >
            + Nueva tarea
          </button>
        </div>

        <p v-if="tasksLoading">Cargando tareas...</p>
        <p v-else-if="tasksError" class="text-red-600">{{ tasksError }}</p>
        <p v-else-if="tasks.length === 0" class="text-gray-500">
          No hay tareas todavía.
        </p>

        <ul v-else class="space-y-2">
          <li
            v-for="task in tasks"
            :key="task.id"
            class="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-sm text-gray-500">{{ task.description }}</p>
              <p class="text-sm text-gray-500">Estado: {{ task.status }}</p>
              <p class="text-sm text-gray-500">Fecha límite: {{ task.date_limit }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="openEditModal(task)"
                class="text-indigo-600 text-sm hover:underline"
              >
                Editar
              </button>
              <button
                @click="handleDeleteTask(task.id)"
                class="text-red-600 text-sm hover:underline"
              >
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal de crear/editar tarea -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">
          {{ editingTask ? 'Editar tarea' : 'Nueva tarea' }}
        </h3>

        <form @submit.prevent="handleTaskSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Título</label>
            <input
              v-model="taskTitle"
              type="text"
              required
              class="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              v-model="taskDescription"
              rows="3"
              class="w-full border rounded px-3 py-2"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Estado</label>
            <select
              v-model="taskStatus"
              required
              class="w-full border rounded px-3 py-2"
            >
              <option value="">Selecciona un estado</option>
              <option value="todo">Registrada</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Fecha límite</label>
            <input
              v-model="taskDateLimit"
              type="date"
              class="w-full border rounded px-3 py-2"
            />
          </div>

          <p v-if="taskError" class="text-red-600 text-sm">{{ taskError }}</p>

          <div class="flex gap-3 justify-end">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded border hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="savingTask"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ savingTask ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>