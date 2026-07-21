import Swal from 'sweetalert2'
import { toast } from 'vue3-toastify'


// --- Confirmaciones (reemplaza confirm() nativo) ---
export async function confirmAction(message, title = '¿Estás seguro?') {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626', // rojo, para acciones destructivas
    cancelButtonColor: '#6b7280',
  })

  return result.isConfirmed
}

// --- Toasts (reemplaza alert() y feedback silencioso) ---
export function notifySuccess(message) {
  toast.success(message, { autoClose: 3000 })
}

export function notifyError(message) {
  toast.error(message, { autoClose: 4000 })
}

export function notifyWarning(message) {
  toast.warning(message, { autoClose: 4000 })
}

export function notifyInfo(message) {
  toast.info(message, { autoClose: 4000 })
}