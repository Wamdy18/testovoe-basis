import { watch, computed, type ComputedRef } from 'vue'
import type { Note } from '~/types/types'
import { useUndoRedo, type UndoRedo } from './useUndoRedo'
import { deepClone } from '~/utils/clone'
import { deepEqual } from '~/utils/deepEqual'
import { getActiveStorage } from '~/utils/storage'
import { loadNoteDraft, saveNoteDraft, clearNoteDraft } from '~/utils/draftStorage'
import { debounce } from '~/utils/debounce'

export interface NoteDraft extends UndoRedo<Note> {
  hasUnsavedChanges: ComputedRef<boolean>
  hasRestorableDraft: boolean
  restore: () => boolean
  apply: () => void
  discard: () => void
}

export function useNoteDraft(note: Note): NoteDraft {
  const history = useUndoRedo<Note>(note)
  const original = deepClone(note)

  const hasUnsavedChanges = computed(() => !deepEqual(history.current.value, original))

  const persistDraft = debounce(() => {
    const storage = getActiveStorage()
    if (storage) {
      saveNoteDraft(storage, note.id, history.current.value)
    }
  }, 500)

  watch(() => history.current.value, persistDraft, { deep: true })

  const hasRestorableDraft = (() => {
    const storage = getActiveStorage()
    if (!storage) return false
    const stored = loadNoteDraft(storage, note.id)
    return stored !== null && !deepEqual(stored, original)
  })()

  function restore(): boolean {
    const storage = getActiveStorage()
    if (!storage) return false
    const stored = loadNoteDraft(storage, note.id)
    if (!stored) return false
    history.reset(stored)
    return true
  }

  function apply(): void {
    const storage = getActiveStorage()
    if (storage) clearNoteDraft(storage, note.id)
    history.reset(history.current.value)
  }
  function discard(): void {
    const storage = getActiveStorage()
    if (storage) clearNoteDraft(storage, note.id)
    history.reset(original)
  }

  return {
    ...history,
    hasUnsavedChanges,
    hasRestorableDraft,
    restore,
    apply,
    discard,
  }
}
