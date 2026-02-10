import { ref } from 'vue'

const MENU_kEY = Symbol('context-menu-key')

export interface ContextMenuType {
  id: symbol
  hideMenu: () => void
}

export const useContextMenu = () => {
  const activeMenu = ref<ContextMenuType | null>(null)
  const setActiveMenu = (menu: ContextMenuType) => {
    if (activeMenu.value && activeMenu.value !== menu) {
      activeMenu.value.hideMenu()

    }
    activeMenu.value = menu
  }

  return {
    MENU_kEY,
    activeMenu,
    setActiveMenu
  }
}
