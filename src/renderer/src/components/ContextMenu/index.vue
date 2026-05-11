<template>
  <div class="context-menu-wrapper relative block w-full" @contextmenu="showMenu">
    <slot></slot>
  </div>
  <Teleport to="body">
    <div class="context-menu  z-[9999] fixed" :style="{ left: `${x}px`, top: `${y}px` }" v-if="visible" ref="menuRef">
      <div v-for="(item, index) in items" :key="index" class="menu-item" @click="(e) => handleClickMenu(item, e)">
        {{ item.label }}
      </div>

    </div>
  </Teleport>

</template>

<script lang="ts" setup>
import { ref, inject, onMounted, onUnmounted, Ref, nextTick } from 'vue'
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
const GAP = 6  // 菜单与鼠标之间的间距

const showMenu = async (e) => {
  e.preventDefault()
  if (menuManager?.activeMenu.value?.id === menuId.value) {
    menuManager.setActiveMenu(null)


  }
  x.value = e.clientX + GAP
  y.value = e.clientY + GAP
  visible.value = true


  menuManager?.setActiveMenu({
    id: menuId.value,
    hideMenu
  })


  // 防止菜单超出窗口
  await nextTick()

  const menuEl = menuRef.value
  if (!menuEl) return

  const { innerWidth, innerHeight } = window
  const rect = menuEl.getBoundingClientRect()


  if (rect.right > innerWidth) {
    x.value = e.clientX - rect.width - GAP
  }


  if (rect.bottom > innerHeight) {
    y.value = e.clientY - rect.height - GAP
  }


  x.value = Math.max(GAP, x.value)
  y.value = Math.max(GAP, y.value)

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

interface Emits {
  (e: 'select' ,item: MenuItem): void

}
const emit = defineEmits<Emits>()

const handleClickMenu = (item: MenuItem,e) => {
  emit('select', item)
  hideMenu()
  e.stopPropagation()
}



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
