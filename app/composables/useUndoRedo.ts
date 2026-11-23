import { ref, shallowRef, computed, type Ref, type ComputedRef } from 'vue'
import { deepClone } from '~/utils/clone'
import { deepEqual } from '~/utils/deepEqual'

export interface UndoRedo<T> {
  current: Ref<T>
  commit: () => void
  commitIfChanged: () => void
  undo: () => void
  redo: () => void
  reset: (value?: T) => void
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  undoLength: ComputedRef<number>
  redoLength: ComputedRef<number>
}

export function useUndoRedo<T>(initial: T, limit = 50): UndoRedo<T> {
  const current = ref<T>(deepClone(initial)) as Ref<T>
  const undoStack = shallowRef<T[]>([])
  const redoStack = shallowRef<T[]>([])

  let baseline: T = deepClone(initial)

  function snapshot(): T {
    return deepClone(current.value)
  }

  function commit(): void {
    undoStack.value = [...undoStack.value, baseline].slice(-limit)
    redoStack.value = []
    baseline = snapshot()
  }

  function commitIfChanged(): void {
    if (!deepEqual(current.value, baseline)) {
      commit()
    }
  }

  function undo(): void {
    const stack = undoStack.value
    if (stack.length === 0) return

    redoStack.value = [...redoStack.value, snapshot()]
    const prev = stack[stack.length - 1]
      if (prev === undefined) return
    undoStack.value = stack.slice(0, -1)
    current.value = prev
    baseline = snapshot()
  }

  function redo(): void {
    const stack = redoStack.value
    if (stack.length === 0) return

    undoStack.value = [...undoStack.value, snapshot()].slice(-limit)
    const next = stack[stack.length - 1]
    if (next === undefined) return
    redoStack.value = stack.slice(0, -1)
    current.value = next
    baseline = snapshot()
  }

  function reset(value?: T): void {
    current.value = value === undefined ? deepClone(initial) : deepClone(value)
    undoStack.value = []
    redoStack.value = []
    baseline = deepClone(current.value)
  }

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)
  const undoLength = computed(() => undoStack.value.length)
  const redoLength = computed(() => redoStack.value.length)

  return {
    current,
    commit,
    commitIfChanged,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    undoLength,
    redoLength,
  }
}
