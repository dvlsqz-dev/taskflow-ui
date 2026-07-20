import { defineStore } from 'pinia'
import api from '@/api/axios'


export const useAuthStore = defineStore('auth', {
  // state — los datos que guarda el store
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  // getters — como computed, valores derivados del state
  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  // actions — funciones que modifican el state
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    clearAuth() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
    async register(data) {
        try {
            const response = await api.post('/auth/register', data)
            const { token, user } = response.data.data
            this.setToken(token)
            this.user = user
        } catch (error) {
            console.error('Error during register:', error)
            throw error
        }
    },
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password })
        const { token, user } = response.data.data
        this.setToken(token)
        this.user = user
      } catch (error) {
        console.error('Error during login:', error)
        throw error
      }
    },
    async fetchUser() {
      try {
        const response = await api.get('/auth/me')
        this.user = response.data.data
      } catch (error) {
        console.error('Error fetching user:', error)
        throw error
      }
    },
    async logout() {
        try {
            await api.post('/auth/logout')
            this.clearAuth()
        } catch (error) {
            console.error('Error during logout:', error)
            throw error
        }
    }
}
})