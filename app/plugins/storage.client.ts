import { setActiveStorage, STORAGE_KEY } from '~/utils/storage'
import { useNotesStore } from '~/stores/notes'

export default defineNuxtPlugin(() => {
  setActiveStorage(window.localStorage)

  const store = useNotesStore()
  store.hydrate()

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      store.syncFromStorage()
    }
  })
})
