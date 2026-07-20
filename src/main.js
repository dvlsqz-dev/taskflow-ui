import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
async function initAuth() {
  if(authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.error('Error fetching user during app initialization:', error)
      authStore.clearAuth()
    }
  }
}

initAuth().finally(() => {
    app.mount('#app')
})
