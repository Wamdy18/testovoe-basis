<script setup lang="ts">
 const props = withDefaults(defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean,
    loading?: boolean
 }>(), {
    variant: 'primary',
    disabled: false,
    loading: false,
 })

 const emit = defineEmits<{ click: [event: MouseEvent]}>()

 const onClick = (event: MouseEvent): void => {
    if (props.disabled || props.loading) return
    emit('click', event)
 }
</script>

<template>
    <button
        class="btn"
        :class="[`btn--${variant}`]"
        :disabled="disabled"
        @click="onClick"
    >
        <div class="btn__content">
            <slot />
        </div>
    </button>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  padding: 9px 16px;
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &__content {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

    // variant  
  &--primary {
    background: var(--color-primary);
    color: #fff;

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }
  }

  &--secondary {
    background: var(--color-secondary);
    color: #fff;

    &:hover:not(:disabled) {
      background: var(--color-secondary-hover);
    }
  }

  &--danger {
    background: var(--color-danger);
    color: #fff;

    &:hover:not(:disabled) {
      background: var(--color-danger-hover);
    }
  }
}
</style>