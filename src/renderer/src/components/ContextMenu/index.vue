<template>
  <div class="context-menu-wrapper h-full w-full relative" @contextmenu="showMenu">
    <slot></slot>
  </div>
  <Teleport to="body">
    <div class="context-menu  z-[9999] fixed" :style="{ left: `${x}px`, top: `${y}px` }" v-if="visible" ref="menuRef">
      <div v-for="(item, index) in items" :key="index" class="menu-item">
        {{ item.label }}
      </div>

    </div>
  </Teleport>

</template>

<script lang="ts" setup>
import { ref, inject, onMounted, onUnmounted ,Ref } from 'vue'
import { useContextMenu, ContextMenuType } from '@/composables/useContextMenu'

interface MenuItem {
  label: string
  value: string
}
interface Props {
  items: MenuItem[]
}
const props = defineProps<Props>()

const { MENU_kEY } = useContextMenu()
const menuManager = inject<{
  activeMenu: Ref<ContextMenuType | null>
  setActiveMenu: (activeMenu: ContextMenuType | null) => void
}>(MENU_kEY)

const menuRef = ref<HTMLDivElement>()
const menuId = ref(Symbol('menu-id'))
const x = ref(0)
const y = ref(0)
const visible = ref(false)

const showMenu = (e) => {
  e.preventDefault()
  if (menuManager?.activeMenu.value?.id === menuId.value) {
    menuManager.setActiveMenu(null)


  }
  x.value = e.clientX
  y.value = e.clientY
  visible.value = true


  menuManager?.setActiveMenu({
    id: menuId.value,
    hideMenu
  })

}
const hideMenu = () => {
  visible.value = false
}
const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    hideMenu()
    console.log('click outside')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (menuManager?.activeMenu.value?.id === menuId.value) {
    menuManager.setActiveMenu(null)
  }
})


</script>

<style scoped lang="scss">
.context-menu {
  backdrop-filter: blur(30px) saturate(210%);
  border-radius: 6px;
  overflow: hidden;
  background-color: rgba(40, 40, 40, 0.7);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 6px 0;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;

  .menu-item {
    padding: 4px 8px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
