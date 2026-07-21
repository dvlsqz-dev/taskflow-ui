import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTasks(projectId, filters = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/projects/${projectId}/tasks`, {
          params: filters, // axios convierte esto en ?status=todo&search=texto
        })
        this.tasks = response.data.data
      } catch (error) {
        this.error = 'No se pudieron cargar las tareas'
        console.error('Error fetching tasks:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTask(projectId, data) {
      try {
        const response = await api.post(`/projects/${projectId}/tasks`, data)
        const newTask = response.data.data
        this.tasks.push(newTask)
        return newTask
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },

    async updateTask(projectId, taskId, data) {
      try {
        const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data)
        const updated = response.data.data

        const index = this.tasks.findIndex(t => t.id === taskId)
        if (index !== -1) {
          this.tasks[index] = updated
        }

        return updated
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },

    async deleteTask(projectId, taskId) {
      try {
        await api.delete(`/projects/${projectId}/tasks/${taskId}`)
        this.tasks = this.tasks.filter(t => t.id !== taskId)
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    },
  },
})