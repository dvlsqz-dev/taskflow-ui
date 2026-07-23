import { describe, it, expect } from 'vitest'
import { extractFieldErrors, extractGeneralMessage } from '../errors'

describe('extractFieldErrors', () => {
  it('extrae el primer mensaje de cada campo cuando hay errores de validación', () => {
    // Arrange: simulamos un error como el que devuelve axios en un 422
    const error = {
      response: {
        data: {
          message: 'The email has already been taken.',
          errors: {
            email: ['The email has already been taken.'],
            password: ['The password must be at least 8 characters.', 'Another rule failed.'],
          },
        },
      },
    }

    // Act
    const result = extractFieldErrors(error)

    // Assert
    expect(result).toEqual({
      email: 'The email has already been taken.',
      password: 'The password must be at least 8 characters.',
    })
  })

  it('devuelve un objeto vacío cuando no hay errores de campo', () => {
    const error = {
      response: {
        data: {
          message: 'Invalid credentials',
          errors: null,
        },
      },
    }

    const result = extractFieldErrors(error)

    expect(result).toEqual({})
  })

  it('devuelve un objeto vacío cuando no hay response en absoluto (error de red)', () => {
    const error = {}

    const result = extractFieldErrors(error)

    expect(result).toEqual({})
  })
})

describe('extractGeneralMessage', () => {
  it('devuelve el mensaje del backend cuando existe', () => {
    const error = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    }

    expect(extractGeneralMessage(error)).toBe('Invalid credentials')
  })

  it('devuelve un mensaje genérico cuando no hay mensaje del backend', () => {
    const error = {}

    expect(extractGeneralMessage(error)).toBe('Ocurrió un error inesperado')
  })
})