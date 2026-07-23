import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectsStore } from '../projects'
import api from '@/api/axios'

// Reemplazamos el módulo axios real por uno simulado
vi.mock('@/api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('projects store', () => {
  beforeEach(() => {
    // Crea una instancia nueva de Pinia antes de cada test,
    // para que los tests no compartan estado entre sí
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetchProjects guarda la lista de proyectos en el estado', async () => {
    // Arrange: simulamos la respuesta que Laravel daría
    api.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: 'Proyecto A', description: 'Prueba' },
          { id: 2, name: 'Proyecto B', description: 'Otra prueba' },
        ],
      },
    })

    const store = useProjectsStore()

    // Act
    await store.fetchProjects()

    // Assert
    expect(api.get).toHaveBeenCalledWith('/projects')
    expect(store.projects).toHaveLength(2)
    expect(store.projects[0].name).toBe('Proyecto A')
    expect(store.loading).toBe(false)
  })

  it('fetchProjects marca error cuando la petición falla', async () => {
    api.get.mockRejectedValue(new Error('Network error'))

    const store = useProjectsStore()

    await expect(store.fetchProjects()).rejects.toThrow()

    expect(store.error).toBe('No se pudieron cargar los proyectos')
    expect(store.loading).toBe(false)
  })

  it('createProject agrega el nuevo proyecto a la lista', async () => {
    api.post.mockResolvedValue({
      data: {
        data: { id: 3, name: 'Proyecto Nuevo', description: 'Recién creado' },
      },
    })

    const store = useProjectsStore()
    store.projects = [{ id: 1, name: 'Existente', description: '' }]

    await store.createProject({ name: 'Proyecto Nuevo', description: 'Recién creado' })

    expect(store.projects).toHaveLength(2)
    expect(store.projects[1].name).toBe('Proyecto Nuevo')
  })

  it('deleteProject quita el proyecto de la lista', async () => {
    api.delete.mockResolvedValue({})

    const store = useProjectsStore()
    store.projects = [
      { id: 1, name: 'Proyecto A' },
      { id: 2, name: 'Proyecto B' },
    ]

    await store.deleteProject(1)

    expect(store.projects).toHaveLength(1)
    expect(store.projects[0].id).toBe(2)
  })
})