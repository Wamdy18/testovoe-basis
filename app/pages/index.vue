<script setup lang="ts">
const notes = reactive([
    {
        id: '1',
        title: 'Список продуктов',
        todos: [
            {
                id: '1',
                text: 'Хлеб',
                completed: true,
            },
            {
                id: '2',
                text: 'Колбаса',
                completed: false,
            },
            {
                id: '3',
                text: 'Свекла',
                completed: false,
            },
            {
                id: '4',
                text: 'Мандарины',
                completed: false,
            },
            {
                id: '5',
                text: 'Бананы',
                completed: false,
            },
            {
                id: '6',
                text: 'Кефир',
                completed: false,
            },
        ]
    },
    {
        id: '2',
        title: 'Список продуктов 2',
        todos: []
    },
    {
        id: '3',
        title: 'Список продуктов 3',
        todos: [
            {
                id: '1',
                text: 'Хлеб',
                completed: false,
            },
            {
                id: '2',
                text: 'Колбаса',
                completed: false,
            },
            {
                id: '3',
                text: 'Свекла',
                completed: false,
            },
            {
                id: '4',
                text: 'Мандарины',
                completed: false,
            },
            {
                id: '5',
                text: 'Бананы',
                completed: false,
            },
        ]
    },
    {
        id: '4',
        title: 'Список продуктов 4',
        todos: [
            {
                id: '1',
                text: 'Хлеб',
                completed: false,
            },
            {
                id: '2',
                text: 'Колбаса',
                completed: false,
            },
            {
                id: '3',
                text: 'Свекла',
                completed: false,
            },
            {
                id: '4',
                text: 'Мандарины',
                completed: false,
            },
            {
                id: '5',
                text: 'Бананы',
                completed: false,
            },
            {
                id: '6',
                text: 'Кефир',
                completed: false,
            },
            {
                id: '7',
                text: 'Маргарита',
                completed: false,
            },
            {
                id: '8',
                text: 'Карбонара',
                completed: false,
            },
        ]
    },
])
</script>

<template>
    <div class="mainpage">
        <header class="mainpage__header">
            <h1>Заметки</h1>
            <Button>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                Создать заметку
            </Button>
        </header>
        <main class="mainpage__main">
            <div v-if="notes.length > 0" class="grid">
                <NoteCard v-for="note in notes" :key="note.id" :note="note" />
            </div>
        </main>
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