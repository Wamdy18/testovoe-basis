<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Note } from '~/types/types'
import { deepClone } from '~/utils/clone'

const route = useRoute()
const store = useNotesStore()

function toSingleId(id: string | string[] | undefined): string {
  if (Array.isArray(id)) return id[0] ?? ''
  return id ?? ''
}

const noteId = computed(() => toSingleId(route.params.id))

const liveNote = computed(() => store.getNote(noteId.value))

const snapshot = ref<Note | null>(liveNote.value ? deepClone(liveNote.value) : null)

const deletedExternally = ref(false)

watch(liveNote, (current, previous) => {
  if (previous && !current) {
    deletedExternally.value = true
  }
})


</script>

<template>
    <div class="note-page">
        <div v-if="snapshot" class="note-page__editor">
            <NoteEditor :note="snapshot" :deleted-externally="deletedExternally" />
        </div>

      <EmptyState
        v-else
        title="Заметка не найдена"
        description="Возможно, она была удалена или ссылка неверна."
      >
        <Button @click="navigateTo('/')">На главную</Button>
      </EmptyState>
    </div>
</template>

<style lang="css" scoped>
.note-page {
    max-width: 680px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-5)
}
</style>