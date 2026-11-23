import type { StorageLike } from '../utils/storage'

/**
 * Простой in-memory мок хранилища для тестов. Повторяет интерфейс localStorage,
 * но без браузера.
 */
export interface MemoryStorage extends StorageLike {
  data: Map<string, string>
}

export function createMemoryStorage(): MemoryStorage {
  const data = new Map<string, string>()

  return {
    data,
    getItem(key: string): string | null {
      return data.has(key) ? (data.get(key) as string) : null
    },
    setItem(key: string, value: string): void {
      data.set(key, value)
    },
    removeItem(key: string): void {
      data.delete(key)
    },
  }
}
