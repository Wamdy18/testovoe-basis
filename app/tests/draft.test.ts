import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActiveStorage } from '../utils/storage'
import { loadNoteDraft, saveNoteDraft, clearNoteDraft, draftKey } from '../utils/draftStorage'
import { useNoteDraft } from '../composables/useNoteDraft'
import { createMemoryStorage } from './helpers'
import type { Note } from '../types/types'

describe('draft storage', () => {
  it('сохраняет, загружает и удаляет черновик', () => {
    const storage = createMemoryStorage()
    const note: Note = { id: 'n1', title: 'Заголовок', todos: [] }

    saveNoteDraft(storage, note.id, note)
    expect(loadNoteDraft(storage, note.id)?.title).toBe('Заголовок')

    clearNoteDraft(storage, note.id)
    expect(loadNoteDraft(storage, note.id)).toBeNull()
  })

  it('игнорирует повреждённый черновик', () => {
    const storage = createMemoryStorage()
    storage.setItem(draftKey('n1'), '{broken json')
    expect(loadNoteDraft(storage, 'n1')).toBeNull()
  })
})

describe('useNoteDraft', () => {
  beforeEach(() => {
    setActiveStorage(null)
  })

  afterEach(() => {
    setActiveStorage(null)
  })

  it('обнаруживает и восстанавливает черновик', () => {
    const storage = createMemoryStorage()
    const saved: Note = { id: 'n1', title: 'Исходное', todos: [] }
    const stored: Note = { id: 'n1', title: 'Отредактировано', todos: [] }
    saveNoteDraft(storage, 'n1', stored)
    setActiveStorage(storage)

    const draft = useNoteDraft(saved)
    expect(draft.hasRestorableDraft).toBe(true)

    expect(draft.restore()).toBe(true)
    expect(draft.current.value.title).toBe('Отредактировано')
  })

  it('не предлагает восстановление, если черновик совпадает с сохранённым', () => {
    const storage = createMemoryStorage()
    const saved: Note = { id: 'n1', title: 'Заголовок', todos: [] }
    saveNoteDraft(storage, 'n1', saved)
    setActiveStorage(storage)

    const draft = useNoteDraft(saved)
    expect(draft.hasRestorableDraft).toBe(false)
  })

  it('отслеживает несохранённые изменения', () => {
    const draft = useNoteDraft({ id: 'n1', title: 'Заголовок', todos: [] })
    expect(draft.hasUnsavedChanges.value).toBe(false)

    draft.current.value.title = 'Другое название'
    expect(draft.hasUnsavedChanges.value).toBe(true)
  })

  it('discard возвращает исходное состояние и удаляет черновик', () => {
    const storage = createMemoryStorage()
    setActiveStorage(storage)
    const saved: Note = { id: 'n1', title: 'Заголовок', todos: [] }

    const draft = useNoteDraft(saved)
    draft.current.value.title = 'Изменено'
    saveNoteDraft(storage, 'n1', draft.current.value)

    draft.discard()

    expect(draft.current.value.title).toBe('Заголовок')
    expect(loadNoteDraft(storage, 'n1')).toBeNull()
    expect(draft.canUndo.value).toBe(false)
  })

  it('apply сбрасывает историю и удаляет черновик', () => {
    const storage = createMemoryStorage()
    setActiveStorage(storage)
    const saved: Note = { id: 'n1', title: 'Заголовок', todos: [] }

    const draft = useNoteDraft(saved)
    draft.current.value.title = 'Изменено'
    draft.commit()
    saveNoteDraft(storage, 'n1', draft.current.value)

    draft.apply()

    expect(draft.canUndo.value).toBe(false)
    expect(loadNoteDraft(storage, 'n1')).toBeNull()
    expect(draft.current.value.title).toBe('Изменено')
  })
})
