<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '~/types/types'

const props = withDefaults(defineProps<{
    note: Note,
    maxTodos?: number
}>(), {
    title: '',
    maxTodos: 5,
})

const previewTodos = computed(() => props.note.todos.slice(0, props.maxTodos))
const remaining = computed(() => Math.max(0, props.note.todos.length - props.maxTodos))
</script>

<template>
    <article class="card">
        <div class="card__head">
            <h3 class="card__title">
                {{ note.title.trim() || 'Без названия' }}
            </h3>
            <div class="card__actions">
                <button class="card__action" @click="() => {}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                        <path
                        d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Z"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linejoin="round"
                        />
                        <path d="m13.5 6.5 4 4" stroke="currentColor" stroke-width="1.6" />
                    </svg>
                </button>
                <button class="card__action card__action--danger" @click="() => {}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="card__main">
            <ul v-if="previewTodos.length > 0" class="card__todos">
                <li v-for="todo in previewTodos" :key="todo.id" class="card__todo">
                    <span class="card__mark">
                        <svg v-if="todo.completed" viewBox="0 0 12 10" width="10" height="10" fill="none">
                            <path d="M1 5.2 4.3 8.5 11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    <span class="card__todo-text" :class="{ 'card__todo-text--done': todo.completed }">
                        {{ todo.text }}
                    </span>
                </li>
            </ul>
            <span v-else class="card__empty">Задач нет</span>

            <span v-if="remaining > 0" class="card__more">+ еще {{ remaining }}</span>
        </div>
    </article>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: var(--space-5);
  min-width: 0; 
  background: #fff;
  border: 1px solid #e6e8ef;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  transition: 0.15s ease all;

  &:hover {
    box-shadow: 0 6px 16px rgba(16, 24, 40, 0.08);
    transform: translateY(-1px);
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__title {
    flex: 1;
    font-size: 16px;
    line-height: 1.4;
    color: var(--color-text);
    word-break: break-word;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    min-height: 2.8em;
  }

  &__actions {
    display: flex;
    gap: var(--space-1);
    transition: opacity 0.15s ease;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--border-radius-sm);
    background: var(--color-secondary);
    border: 1px solid var(--color-secondary);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background-color var(--transition-fast), color var(--transition-fast);

    &--danger {
      background: var(--color-danger-soft);
      color: var(--color-danger);
      border: 1px solid var(--color-danger-soft);
    }
  }

  &__todos {
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
  }

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    border: 1.5px solid var(--color-secondary);
    border-radius: 5px;
    color: #fff;

    &--done {
      background: var(--color-primary);
      border-color: var(--color-primary);
    }
  }
  &__todo-text {
    flex: 1;
    min-width: 0; 
    font-size: 14px;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--done {
      color: var(--color-text-grey);
      text-decoration: line-through;
    }
  }

  &__empty,
  &__more {
    font-size: 13px;
    color: var(--color-text-grey);
  }
}
</style>