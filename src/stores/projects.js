import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/projects')
        this.projects = response.data.data
      } catch (error) {
        this.error = 'No se pudieron cargar los proyectos'
        console.error('Error fetching projects:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProject(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/projects/${id}`)
        this.currentProject = response.data.data
      } catch (error) {
        this.error = 'No se pudo cargar el proyecto'
        console.error('Error fetching project:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProject(data) {
      try {
        const response = await api.post('/projects', data)
        const newProject = response.data.data
        this.projects.push(newProject)
        return newProject
      } catch (error) {
        console.error('Error creating project:', error)
        throw error
      }
    },

    async updateProject(id, data) {
      try {
        const response = await api.put(`/projects/${id}`, data)
        const updated = response.data.data

        const index = this.projects.findIndex(p => p.id === id)
        if (index !== -1) {
          this.projects[index] = updated
        }
        this.currentProject = updated

        return updated
      } catch (error) {
        console.error('Error updating project:', error)
        throw error
      }
    },

    async deleteProject(id) {
      try {
        await api.delete(`/projects/${id}`)
        this.projects = this.projects.filter(p => p.id !== id)
      } catch (error) {
        console.error('Error deleting project:', error)
        throw error
      }
    },

    async exportReport(id, projectName) {
      try {
        const response = await api.get(`/projects/${id}/report`, {
          responseType: 'blob',
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `proyecto-${projectName}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error exporting report:', error)
        throw error
      }
    },
  },
})