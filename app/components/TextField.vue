<script setup lang="ts">
const props = withDefaults(defineProps<{
    label?: string
    placeholder?: string
}>(), {
    label: '',
    placeholder: 'Название заметки'
})
</script>

<template>
<div class="text-field">
    <label v-if="label" class="text-field__label">{{ label }}</label>

    <textarea
        class="text-field__textarea"
        :placeholder="placeholder"
    />
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