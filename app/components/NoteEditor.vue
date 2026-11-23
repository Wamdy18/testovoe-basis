<script setup lang="ts">
</script>

<template>
    <div class="editor">
        <header class="editor__topbar">
            <div class="editor__topbar-left">
                <button class="editor__back" @click="navigateTo('/')">Назад</button>
                <div class="editor__history">
                    <button class="editor__history-btn">
                      Отменить(Ctrl+Z)</button>
                    <button class="editor__history-btn">Повторить(Ctrl+Shift+Z)</button>
                </div>
            </div>
            <div v-if="true" class="editor__topbar-right">
                <span class="editor__badge">
                    Не сохранено
                </span>
            </div>
        </header>
        <main class="editor__main">
            <TextField />
            <section class="editor__todos">
              <h2 class="editor__section-title">Задачи</h2>

              <ul v-if="true" class="editor__todo-list">
                <li v-for="todo in [1,2,3]" :key="todo" class="editor__todo">
                  <Checkbox
                  :modelValue="todo == 1 ? true : false"
                  />
                  <input
                    value="Задача"
                    class="editor__todo-text"
                    type="text"
                  />
                  <button
                    type="button"
                    class="editor__remove"
                  >
                    Удалить
                  </button>
                </li>
              </ul>
              <p v-else class="editor__todo-empty">Пока нет задач — добавьте первую.</p>

              <div class="editor__add">
                <TextField
                  placeholder="Новая задача"
                  aria-label="Новая задача"
                />
                <Button variant="secondary">Добавить</Button>
              </div>
              <footer class="editor__actions">
                <Button variant="danger">Удалить заметку</Button>
                <div class="editor__actions-right">
                  <Button variant="secondary">Отменить редактирование</Button>
                  <Button>Сохранить</Button>
                </div>
              </footer>
            </section>
        </main>
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
</style>