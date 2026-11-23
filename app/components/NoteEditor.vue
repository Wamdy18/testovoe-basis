<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Note, TodoItem } from '~/types/types'
import { generateId } from '~/utils/id'

const props = defineProps<{
  note: Note
  deletedExternally: boolean
}>()

const store = useNotesStore()
const toast = useToast()

const draft = useNoteDraft(props.note)

useHotkeys([
  { code: 'KeyZ', handler: () => draft.undo() },
  { code: 'KeyZ', shift: true, handler: () => draft.redo() },
])


const title = computed(() => draft.current.value.title)
const canSave = computed(() => title.value.trim() !== '' && !props.deletedExternally)

function onTitleBlur(): void {
  draft.commitIfChanged()
}


const newTodoText = ref('')

function addTodo(): void {
  const text = newTodoText.value.trim()
  if (!text) return

  const todo: TodoItem = { id: generateId(), text, completed: false }
  draft.current.value.todos = [...draft.current.value.todos, todo]
  newTodoText.value = ''
  draft.commit()
}

function removeTodo(id: string): void {
  draft.current.value.todos = draft.current.value.todos.filter((t) => t.id !== id)
  draft.commit()
}

function toggleTodo(id: string): void {
  const todo = draft.current.value.todos.find((t) => t.id === id)
  if (!todo) return
  todo.completed = !todo.completed
  draft.commit()
}

function onTodoTextBlur(): void {
  draft.commitIfChanged()
}

function onAddKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTodo()
  }
}

const showCancelConfirm = ref(false)
const showDeleteConfirm = ref(false)
const showRestoreDraft = ref(draft.hasRestorableDraft)

function save(): void {
  if (props.deletedExternally) {
    toast.show('Нельзя сохранить: заметка удалена в другой вкладке', 'error')
    return
  }
  if (!canSave.value) return

  draft.apply()
  store.updateNote(props.note.id, draft.current.value)
  toast.show('Заметка сохранена', 'success')
  navigateTo('/')
}

function cancel(): void {
  draft.discard()
  navigateTo('/')
}

function confirmDelete(): void {
  store.removeNote(props.note.id)
  toast.show('Заметка удалена', 'success')
  navigateTo('/')
}

function onRestore(): void {
  draft.restore()
  showRestoreDraft.value = false
}

function onDiscardRestore(): void {
  draft.discard()
  showRestoreDraft.value = false
}
</script>

<template>
    <div class="editor">
        <header class="editor__topbar">
            <div class="editor__topbar-left">
                <button class="editor__back" @click="navigateTo('/')">Назад</button>
                <div class="editor__history">
                    <button 
                      @click="draft.undo()"
                      :disabled="!draft.canUndo.value"
                      class="editor__history-btn">
                      Отменить(Ctrl+Z)</button>
                    <button 
                      @click="draft.redo()"
                      :disabled="!draft.canRedo.value"
                      class="editor__history-btn">Повторить(Ctrl+Shift+Z)</button>
                </div>
            </div>
            <div v-if="draft.hasUnsavedChanges.value" class="editor__topbar-right">
                <span class="editor__badge">
                    Не сохранено
                </span>
            </div>
        </header>

        <div v-if="deletedExternally" class="editor__warning" role="alert">
          Заметка была удалена в другой вкладке. Сохранение заблокировано.
        </div>

        <main class="editor__main">
            <TextField
              v-model="draft.current.value.title"
              multiline
              size="lg"
              aria-label="Название заметки"
              placeholder="Название заметки"
              @blur="onTitleBlur"
            />
            <section class="editor__todos">
              <h2 class="editor__section-title">Задачи</h2>

              <ul v-if="draft.current.value.todos.length > 0" class="editor__todo-list">
                <li v-for="todo in draft.current.value.todos" :key="todo.id" class="editor__todo">
                  <Checkbox
                  :modelValue="todo.completed"
                  @update:model-value="toggleTodo(todo.id)"
                  />
                  <input
                    v-model="todo.text"
                    class="editor__todo-text"
                    type="text"
                    @blur="onTodoTextBlur"
                  />
                  <button
                    type="button"
                    class="editor__remove"
                    @click="removeTodo(todo.id)"
                  >
                    Удалить
                  </button>
                </li>
              </ul>
              <p v-else class="editor__todo-empty">Пока нет задач — добавьте первую.</p>

              <div class="editor__add">
                <TextField
                  v-model="newTodoText"
                  placeholder="Новая задача"
                  @keydown="onAddKeydown"
                />
                <Button variant="secondary" @click="addTodo">Добавить</Button>
              </div>
            </section>
        </main>
        <footer class="editor__actions">
          <Button variant="danger" @click="showDeleteConfirm = true">Удалить заметку</Button>
          <div class="editor__actions-right">
            <Button variant="secondary" @click="showCancelConfirm = true">Отменить редактирование</Button>
            <Button :disabled="!canSave" @click="save">Сохранить</Button>
          </div>
        </footer>

    <ConfirmDialog
      v-model="showCancelConfirm"
      title="Отменить редактирование?"
      message="Все несохранённые изменения будут потеряны."
      confirm-text="Отменить"
      @confirm="cancel"
    />

    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Удалить заметку?"
      message="Заметка будет удалена безвозвратно."
      confirm-text="Удалить"
      danger
      @confirm="confirmDelete"
    />

    <ConfirmDialog
      v-model="showRestoreDraft"
      title="Восстановить черновик?"
      message="Найден несохранённый черновик этой заметки. Восстановить его?"
      confirm-text="Восстановить"
      cancel-text="Не восстанавливать"
      @confirm="onRestore"
      @cancel="onDiscardRestore"
    />
    </div>
</template>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);

  &__topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__topbar-left {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  &__back,
  &__history-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--button-padding);
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius-sm);
    background: #fff;
    color: var(--color-text);
    cursor: pointer;
    transition: 0.15s ease all;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &:hover {
        background-color: #eee;
    }
  }

  &__history {
    display: flex;
    gap: var(--space-2);
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 5px 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-primary);
    background: #fff;
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius-sm);
  }

  &__warning {
    padding: var(--space-3) var(--space-4);
    font-size: 14px;
    color: var(--color-danger);
    background: var(--color-danger-soft);
    border: 1px solid var(--color-danger);
    border-radius: var(--border-radius-md);
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  &__todos {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  &__section-title {
    font-size: 15px;
    color: var(--color-text);
  }

  &__todo-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__todo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: #fff;
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius-md);
    transition: 0.15s ease all;

    &:focus-within {
      border-color: var(--color-primary);
    }
  }

  &__todo-text {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 15px;
    font-family: inherit;
    color: var(--color-text);

    &:focus {
      outline: none;
    }
  }

  &__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--color-danger-soft);
    color: var(--color-danger);
    cursor: pointer;
    transition: 0.15s ease all;
  }

  &__todo-empty {
    font-size: 14px;
    color: var(--color-text-grey);
  }

  &__add {
    display: flex;
    align-items: center;
    gap: var(--space-2);

    :deep(.text-field) {
      flex: 1;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-secondary);
  }

  &__actions-right {
    display: flex;
    gap: var(--space-2);
  }

}

@media (max-width: 640px) {
  .editor {

    &__topbar-left {
      flex-direction: column;
      align-items: start;
    }
    &__actions {
      flex-direction: column;
      align-items: stretch;
    }

    &__actions-right {
      flex-direction: column-reverse;
    }
  }
}
</style>