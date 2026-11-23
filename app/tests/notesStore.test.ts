import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNotesStore } from '../stores/notes'
import {
  setActiveStorage,
  loadNotes,
  saveNotes,
  STORAGE_KEY,
  SCHEMA_VERSION,
} from '../utils/storage'
import { createMemoryStorage } from './helpers'
import type { Note } from '../types/types'

describe('notes store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    setActiveStorage(null)
  })

  it('создаёт, обновляет и удаляет заметки', () => {
    const store = useNotesStore()

    const note = store.createNote()
    expect(store.notes).toHaveLength(1)
    expect(note.id).toBeTruthy()

    store.updateNote(note.id, { ...note, title: 'Новое название' })
    expect(store.getNote(note.id)?.title).toBe('Новое название')

    store.removeNote(note.id)
    expect(store.notes).toHaveLength(0)
    expect(store.getNote(note.id)).toBeUndefined()
  })

  it('загружает заметки из хранилища при hydrate', () => {
    const storage = createMemoryStorage()
    const existing: Note[] = [{ id: '1', title: 'Заголовок', todos: [] }]
    saveNotes(storage, existing)
    setActiveStorage(storage)

    const store = useNotesStore()
    store.hydrate()

    expect(store.notes).toHaveLength(1)
    expect(store.notes[0]?.id).toBe('1')
    expect(store.notes[0]?.title).toBe('Заголовок')
  })

  it('обрабатывает несовпадение версии схемы как пустое состояние', () => {
    const storage = createMemoryStorage()
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION + 1, notes: [] }))
    setActiveStorage(storage)

    const store = useNotesStore()
    store.hydrate()

    expect(store.notes).toHaveLength(0)
  })

  it('игнорирует повреждённые данные в хранилище', () => {
    const storage = createMemoryStorage()
    storage.setItem(STORAGE_KEY, '{not a valid json')
    setActiveStorage(storage)

    const store = useNotesStore()
    store.hydrate()

    expect(store.notes).toHaveLength(0)
  })

  it('пишет в хранилище с debounce после изменений', () => {
    vi.useFakeTimers()
    try {
      const storage = createMemoryStorage()
      setActiveStorage(storage)
      const store = useNotesStore()

      store.createNote()
      store.createNote()
      store.createNote()

      // До истечения debounce данные ещё не записаны.
      expect(loadNotes(storage)).toBeNull()

      vi.advanceTimersByTime(600)

      const saved = loadNotes(storage)
      expect(saved).toHaveLength(3)
    } finally {
      vi.useRealTimers()
    }
  })

  it('сохраняет версию схемы при записи', () => {
    const storage = createMemoryStorage()
    saveNotes(storage, [{ id: '1', title: 'T', todos: [] }])

    const raw = storage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string) as { version: number }
    expect(parsed.version).toBe(SCHEMA_VERSION)
  })

  it('syncFromStorage перечитывает данные из хранилища', () => {
    const storage = createMemoryStorage()
    setActiveStorage(storage)
    const store = useNotesStore()
    store.hydrate()
    expect(store.notes).toHaveLength(0)

    // Имитация изменения в другой вкладке: напрямую пишем в хранилище и синхронизируемся.
    saveNotes(storage, [{ id: '2', title: 'Из другой вкладки', todos: [] }])
    store.syncFromStorage()

    expect(store.notes).toHaveLength(1)
    expect(store.notes[0]?.id).toBe('2')
  })
})
