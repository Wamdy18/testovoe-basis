import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Note } from '~/types/types'
import { getActiveStorage, loadNotes, saveNotes } from '~/utils/storage'
import { generateId } from '~/utils/id'
import { debounce } from '~/utils/debounce'
import { deepClone } from '~/utils/clone'

// задержка debounce
const PERSIST_DELAY = 600

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])

  // отложенная запись в хранилище, читает актуальное состояние на момент вызова.
  const persist = debounce(() => {
    const storage = getActiveStorage()
    if (storage) {
      saveNotes(storage, notes.value)
    }
  }, PERSIST_DELAY)

  // загрузка заметок из хранилища
  function hydrate(): void {
    const storage = getActiveStorage()
    if (!storage) return

    const stored = loadNotes(storage)
    if (stored !== null) {
      notes.value = stored
    }
  }

  // для проверки с другими вкладками
  function syncFromStorage(): void {
    const storage = getActiveStorage()
    if (!storage) return

    const stored = loadNotes(storage)
    if (stored !== null) {
      notes.value = stored
    }
  }

  function createNote(): Note {
    const note: Note = { id: generateId(), title: '', todos: [] }
    notes.value = [...notes.value, note]
    persist()
    return note
  }

  function updateNote(id: string, patch: Note): void {
    const index = notes.value.findIndex((n) => n.id === id)
    if (index === -1) return

    const next = [...notes.value]
    next[index] = deepClone(patch)
    notes.value = next
    persist()
  }

  function removeNote(id: string): void {
    const index = notes.value.findIndex((n) => n.id === id)
    if (index === -1) return

    notes.value = notes.value.filter((n) => n.id !== id)
    persist()
  }

  function getNote(id: string): Note | undefined {
    return notes.value.find((n) => n.id === id)
  }

  return {
    notes,
    hydrate,
    syncFromStorage,
    createNote,
    updateNote,
    removeNote,
    getNote,
  }
})
