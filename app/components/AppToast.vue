<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toasts" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
        role="status"
      >
        <span class="toast__dot" aria-hidden="true" />
        <span class="toast__message">{{ toast.message }}</span>
        <button
          type="button"
          class="toast__close"
          aria-label="Закрыть уведомление"
          @click="dismiss(toast.id)"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.toasts {
  position: fixed;
  bottom: var(--space-5);
  right: var(--space-5);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 360px;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 12px 14px;
  background: #fff;
  border: 1px solid var(--color-secondary);
  border-radius: var(--border-radius-md);

  &__dot {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--color-primary);
  }

  &--success &__dot {
    background: var(--color-primary);
  }

  &--error &__dot {
    background: var(--color-danger);
  }

  &__message {
    flex: 1;
    font-size: 14px;
    color: var(--color-text);
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: var(--border-radius-sm);
    background: transparent;
    color: var(--color-text-grey);
    cursor: pointer;

    &:hover {
      color: var(--color-text);
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: 0.15s ease all;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
