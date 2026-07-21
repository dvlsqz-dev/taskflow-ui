export function extractFieldErrors(error) {
  const errors = error.response?.data?.errors

  if (!errors) return {}

  // Laravel devuelve { campo: ["mensaje1", "mensaje2"] }
  // Nos quedamos solo con el primer mensaje de cada campo
  const fieldErrors = {}
  for (const field in errors) {
    fieldErrors[field] = errors[field][0]
  }

  return fieldErrors
}

export function extractGeneralMessage(error) {
  return error.response?.data?.message || 'Ocurrió un error inesperado'
}