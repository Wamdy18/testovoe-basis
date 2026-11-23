<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    closeOnBackdrop?: boolean
  }>(),
  {
    title: '',
    closeOnBackdrop: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(): HTMLElement[] {
  if (!dialogRef.value) return []
  return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

function close(): void {
  if (!props.modelValue) return
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key !== 'Tab') return

  const focusable = getFocusable()
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        const focusable = getFocusable()
        if (focusable.length > 0) {
          focusable[0]?.focus()
        } else {
          dialogRef.value?.focus()
        }
      })
    } else {
      document.body.style.overflow = ''
      previouslyFocused?.focus()
      previouslyFocused = null
    }
  },
)

function onBackdropClick(event: MouseEvent): void {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal" @keydown="onKeydown">
        <div class="modal__backdrop" @mousedown.self="onBackdropClick" />
        <div
          ref="dialogRef"
          class="modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          tabindex="-1"
        >
          <header v-if="title || $slots.header" class="modal__header">
            <h2 v-if="title" class="modal__title">{{ title }}</h2>
            <slot name="header" />
            <button
              type="button"
              class="modal__close"
              aria-label="Закрыть"
              @click="close"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </button>
          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(16, 18, 27, 0.5);
  }

  &__dialog {
    position: relative;
    width: 100%;
    max-width: 440px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: var(--border-radius-lg);
    outline: none;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-5) var(--space-5) 0;
  }

  &__title {
    flex: 1;
    font-size: 18px;
    color: var(--color-text);
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: var(--border-radius-sm);
    background: transparent;
    color: var(--color-text-grey);
    cursor: pointer;
    transition: 0.15s ease all;

    &:hover {
      color: var(--color-text);
    }
  }

  &__body {
    padding: var(--space-5);
    overflow-y: auto;
    color: var(--color-text);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    padding: 0 var(--space-5) var(--space-5);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease
}

.modal-enter-active .modal__dialog,
.modal-leave-active .modal__dialog {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__dialog,
.modal-leave-to .modal__dialog {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}
</style>
