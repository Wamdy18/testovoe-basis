import { describe, it, expect } from 'vitest'
import { reactive, isReactive } from 'vue'
import { useUndoRedo } from '../composables/useUndoRedo'
import { deepClone } from '../utils/clone'

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface Note {
  title: string
  todos: Todo[]
}

describe('useUndoRedo', () => {
  it('фиксирует изменения и позволяет отменять/повторять', () => {
    const { current, commit, undo, redo } = useUndoRedo<{ count: number }>({ count: 0 })

    current.value.count = 1
    commit()
    current.value.count = 2
    commit()

    undo()
    expect(current.value.count).toBe(1)

    redo()
    expect(current.value.count).toBe(2)
  })

  it('undo возвращает к самому первому состоянию', () => {
    const { current, commit, undo } = useUndoRedo<{ count: number }>({ count: 0 })

    current.value.count = 1
    commit()
    current.value.count = 2
    commit()

    undo()
    expect(current.value.count).toBe(1)
    undo()
    expect(current.value.count).toBe(0)
  })

  it('очищает redo при новом изменении после undo', () => {
    const { current, commit, undo, redo } = useUndoRedo<{ count: number }>({ count: 0 })

    current.value.count = 1
    commit()
    undo()

    current.value.count = 10
    commit()
    redo()

    expect(current.value.count).toBe(10)
  })

  it('commitIfChanged не создаёт запись без изменений', () => {
    const { current, commitIfChanged, undoLength } = useUndoRedo<{ count: number }>({ count: 0 })

    current.value.count = 1
    commitIfChanged()
    expect(undoLength.value).toBe(1)

    commitIfChanged()
    expect(undoLength.value).toBe(1)
  })

  it('не хранит больше 50 шагов (лимит)', () => {
    const { current, commit, undo, canUndo, undoLength } = useUndoRedo<{ count: number }>(
      { count: 0 },
      50,
    )

    for (let i = 1; i <= 55; i++) {
      current.value.count = i
      commit()
    }

    expect(undoLength.value).toBe(50)

    for (let i = 0; i < 50; i++) {
      undo()
    }

    expect(canUndo.value).toBe(false)
    // Самое раннее состояние было вытеснено лимитом — остаётся count = 5.
    expect(current.value.count).toBe(5)
  })

  it('снимки не связаны с текущим состоянием (глубокое клонирование)', () => {
    const { current, commit, undo } = useUndoRedo<Note>({
      title: 'a',
      todos: [{ id: '1', text: 'todo', completed: false }],
    })

    current.value.title = 'b'
    current.value.todos.push({ id: '2', text: 'second', completed: false })
    commit()

    current.value.todos[0]!.text = 'changed'
    commit()

    undo()
    expect(current.value.title).toBe('b')
    expect(current.value.todos).toHaveLength(2)
    expect(current.value.todos[0]?.text).toBe('todo')
  })

  it('reset сбрасывает состояние и историю', () => {
    const { current, commit, undo, reset, canUndo, canRedo } = useUndoRedo<{ count: number }>({
      count: 0,
    })

    current.value.count = 5
    commit()
    undo()
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(true)

    reset()
    expect(current.value.count).toBe(0)
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
  })
})

describe('deepClone', () => {
  it('клонирует глубоко реактивное состояние в обычный объект', () => {
    const source = reactive({
      title: 'a',
      todos: [{ id: '1', text: 'x', completed: false }],
    })

    const copy = deepClone(source)

    // Копия — обычный объект, не реактивный прокси.
    expect(isReactive(copy)).toBe(false)
    expect(isReactive(copy.todos)).toBe(false)
    expect(copy.todos).toHaveLength(1)

    // Изменение копии не затрагивает исходник.
    copy.todos[0]!.text = 'changed'
    copy.todos.push({ id: '2', text: 'y', completed: true })
    expect(source.todos[0]?.text).toBe('x')
    expect(source.todos).toHaveLength(1)
  })
})
