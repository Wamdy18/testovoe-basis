<script setup lang="ts">
const store = useNotesStore()
const toast = useToast()

const noteToDelete = ref<Note | null>(null)

const deleteDialogOpen = computed({
  get: () => noteToDelete.value !== null,
  set: (value: boolean) => {
    if (!value) noteToDelete.value = null
  },
})

const deleteMessage = computed(() => {
  const title = noteToDelete.value?.title.trim() || 'Без названия'
  return `Заметка «${title}» будет удалена безвозвратно.`
})

function onCreate(): void {
  const note = store.createNote()
  navigateTo(`/notes/${note.id}`)
}

function onEdit(note: Note): void {
  navigateTo(`/notes/${note.id}`)
}

function onDeleteRequest(note: Note): void {
  noteToDelete.value = note
}

function onDeleteConfirm(): void {
  if (!noteToDelete.value) return
  store.removeNote(noteToDelete.value.id)
  toast.show('Заметка удалена', 'success')
  noteToDelete.value = null
}
</script>

<template>
    <div class="mainpage">
        <header class="mainpage__header">
            <h1>Заметки</h1>
            <Button @click="onCreate">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                Создать заметку
            </Button>
        </header>
        <main class="mainpage__main">
            <div v-if="store.notes.length > 0" class="grid">
                <NoteCard 
                    v-for="note in store.notes"
                    :key="note.id"
                    :note="note"
                    @edit="onEdit"
                    @delete="onDeleteRequest"
                />
            </div>

            <EmptyState
                v-else
                title="Пока нет заметок"
                description="Создайте первую заметку"
            ></EmptyState>
        </main>

        <ConfirmDialog
        v-model="deleteDialogOpen"
        title="Удалить заметку?"
        :message="deleteMessage"
        confirm-text="Удалить"
        danger
        @confirm="onDeleteConfirm"
        />
    </div>
</template>

<style lang="scss" scoped>
.mainpage {
    max-width: 960px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-5);

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-6);
    }

    
}
</style>