import type { Note, PersistedState } from '../types/types'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const STORAGE_KEY = 'notes-app'
export const SCHEMA_VERSION = 1

let activeStorage: StorageLike | null = null

export function setActiveStorage(storage: StorageLike | null): void {
  activeStorage = storage
}

export function getActiveStorage(): StorageLike | null {
  return activeStorage
}

export function loadNotes(storage: StorageLike): Note[] | null {
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const data = JSON.parse(raw) as PersistedState
    if (data.version !== SCHEMA_VERSION) return null
    if (!Array.isArray(data.notes)) return null
    return data.notes
  } catch {
    return null
  }
}

export function saveNotes(storage: StorageLike, notes: Note[]): void {
  const payload: PersistedState = { version: SCHEMA_VERSION, notes }
  storage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
