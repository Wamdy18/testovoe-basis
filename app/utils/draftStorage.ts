import type { Note } from '../types/types'
import type { StorageLike } from './storage'

export function draftKey(noteId: string): string {
  return `draft:${noteId}`
}

export function loadNoteDraft(storage: StorageLike, noteId: string): Note | null {
  const raw = storage.getItem(draftKey(noteId))
  if (!raw) return null

  try {
    const note = JSON.parse(raw) as Note
    if (typeof note?.id !== 'string' || !Array.isArray(note?.todos)) return null
    return note
  } catch {
    return null
  }
}

export function saveNoteDraft(storage: StorageLike, noteId: string, note: Note): void {
  storage.setItem(draftKey(noteId), JSON.stringify(note))
}

export function clearNoteDraft(storage: StorageLike, noteId: string): void {
  storage.removeItem(draftKey(noteId))
}
