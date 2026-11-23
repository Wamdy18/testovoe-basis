import { reactive, readonly } from 'vue'
import type { DeepReadonly } from 'vue'
import { generateId } from '~/utils/id'

export type ToastType = 'info' | 'success' | 'error'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

const toasts = reactive<ToastItem[]>([])

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 3200): void {
    const id = generateId()
    toasts.push({ id, type, message })

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
  }

  function dismiss(id: string): void {
    const index = toasts.findIndex((t) => t.id === id)
    if (index !== -1) toasts.splice(index, 1)
  }

  return {
    toasts: readonly(toasts) as DeepReadonly<ToastItem[]>,
    show,
    dismiss,
  }
}
