<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    disabled?: boolean
    id?: string
  }>(),
  {
    label: '',
    disabled: false,
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label class="checkbox" :class="{ 'checkbox--disabled': disabled }">
    <input
      :id="id"
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="checkbox__box">
      <svg v-if="modelValue" class="checkbox__check" viewBox="0 0 12 10" fill="none">
        <path d="M1 5.2 4.3 8.5 11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>

<style lang="scss" scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  user-select: none;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    pointer-events: none;
  }

  &__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border: 1.5px solid var(--color-secondary);
    border-radius: 6px;
    background: #fff;
    color: #fff;
    transition: 0.15s ease all;

    .checkbox__input:focus-visible + & {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .checkbox__input:checked + & {
      background: var(--color-primary);
      border-color: var(--color-primary);
    }
  }

  &__check {
    width: 11px;
    height: 11px;
  }

  &__label {
    font-size: 14px;
  }
}
</style>
