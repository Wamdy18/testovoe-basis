<script setup lang="ts">
const props = withDefaults(defineProps<{
    label?: string
    placeholder?: string
    modelValue: string
    error?: string
    type?: string
    disabled?: boolean
    rows?: number
    size?: 'md' | 'lg'
}>(), {
    label: '',
    placeholder: 'Название заметки',
    error: '',
    type: 'text',
    disabled: false,
    rows: 1,
    size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

const inputId = `tf-${Math.random().toString(36).slice(2, 9)}`
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
  autoResize()
}

function autoResize(): void {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
   const border = el.offsetHeight - el.clientHeight
  el.style.height = `${el.scrollHeight + border}px`
}

onMounted(() => {
  nextTick(autoResize)
})

watch(
  () => props.modelValue,
  () => {
    nextTick(autoResize)
  },
)
</script>

<template>
<div class="text-field">
    <label v-if="label" class="text-field__label" :for="inputId">{{ label }}</label>

    <textarea
        class="text-field__textarea"
        :placeholder="placeholder"
        :id="inputId"
        ref="textareaRef"
        :value="modelValue"
        :disabled="disabled"
        :rows="rows"
        @input="onInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @keydown="emit('keydown', $event)"
    />

    <p v-if="error" class="tf__error" role="alert">{{ error }}</p>
</div>
</template>

<style lang="scss" scoped>
.text-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    &__label {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-text);
    }
    &__textarea {
        width: 100%;
        padding: 10px 12px;
        font-size: 15px;
        font-family: inherit;
        line-height: 1.5;
        color: var(--color-text);
        background: #fff;
        border: 1px solid var(--color-secondary);
        border-radius: var(--border-radius-sm);
        resize: none;
        overflow: hidden;
            
        &:hover:not(:disabled) {
        border-color: var(--color-text-grey);
        }

        &:focus {
        outline: none;
        border-color: var(--color-primary);
        }

        &::placeholder {
            color: var(--color-text-grey);
        }
    }
}
</style>