import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginView from '../LoginView.vue'
import { useAuthStore } from '@/stores/auth'

// Simulamos vue-router, ya que el componente usa useRouter/useRoute
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ query: {} }),
}))

function mountLoginView() {
  return mount(LoginView, {
    global: {
      plugins: [createTestingPinia({ stubActions: false })],
      stubs: { RouterLink: true }, // no necesitamos renderizar el link real
    },
  })
}

describe('LoginView', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('llama a authStore.login con el email y password ingresados', async () => {
    const wrapper = mountLoginView()
    const authStore = useAuthStore()
    authStore.login.mockResolvedValue()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('secret123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.login).toHaveBeenCalledWith('test@example.com', 'secret123')
  })

  it('redirige a /dashboard cuando el login es exitoso', async () => {
    const wrapper = mountLoginView()
    const authStore = useAuthStore()
    authStore.login.mockResolvedValue()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('secret123')
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(pushMock).toHaveBeenCalledWith('/dashboard')
  })

  it('muestra un mensaje de error cuando el login falla', async () => {
    const wrapper = mountLoginView()
    const authStore = useAuthStore()
    authStore.login.mockRejectedValue({
      response: { data: { message: 'Invalid credentials', errors: null } },
    })

    await wrapper.find('input[type="email"]').setValue('wrong@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpass')
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Invalid credentials')
  })
})