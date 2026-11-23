<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
  }>(),
  {
    title: 'Подтверждение',
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
    danger: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function onConfirm(): void {
  emit('confirm')
  emit('update:modelValue', false)
}

function onCancel(): void {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    :title="title"
    @update:model-value="emit('update:modelValue', $event)"
    @close="onCancel"
  >
    <p class="confirm__message">{{ message }}</p>
    <template #footer>
      <Button variant="secondary" @click="onCancel">{{ cancelText }}</Button>
      <Button :variant="danger ? 'danger' : 'primary'" @click="onConfirm">
        {{ confirmText }}
      </Button>
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.confirm__message {
  font-size: 15px;
  color: var(--color-text);
}
</style>
