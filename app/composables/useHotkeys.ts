import { onMounted, onBeforeUnmount } from 'vue'

export interface HotkeyCombo {
  code: string
  shift?: boolean
  modifier?: boolean
  alt?: boolean
  handler: () => void
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  )
}

export function useHotkeys(combos: HotkeyCombo[]): void {
  function onKeydown(event: KeyboardEvent): void {
    if (isEditableTarget(event.target)) return

    const modifierPressed = event.ctrlKey || event.metaKey

    for (const combo of combos) {
      if (event.code !== combo.code) continue
      if (modifierPressed !== (combo.modifier ?? true)) continue
      if (event.shiftKey !== (combo.shift ?? false)) continue
      if (event.altKey !== (combo.alt ?? false)) continue

      event.preventDefault()
      combo.handler()
      return
    }
  }

  onMounted(() => document.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
