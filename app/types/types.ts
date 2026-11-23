export interface TodoItem {
    id: string
    text: string
    completed: boolean
}

export interface Note {
    id: string
    title: string
    todos: TodoItem[]
}

export interface PersistedState {
  version: number
  notes: Note[]
}