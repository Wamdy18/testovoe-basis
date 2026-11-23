<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty">
    <h3 class="empty__title">{{ title }}</h3>
    <p v-if="description" class="empty__description">{{ description }}</p>
    <div v-if="$slots.default" class="empty__action">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  padding: var(--space-7) var(--space-4);

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-primary);
  }

  &__title {
    font-size: 18px;
    color: var(--color-text);
  }

  &__description {
    max-width: 360px;
    font-size: 14px;
    color: var(--color-text-grey);
  }

  &__action {
    margin-top: var(--space-2);
  }
}
</style>
