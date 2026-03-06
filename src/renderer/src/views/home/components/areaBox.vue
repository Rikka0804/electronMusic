<template>
  <div class="area-box">
    <div class="head mb-[10px]">
      <div class="title flex items-center justify-between">
        <slot name="title"></slot>

        <div class="move-container flex items-center  gap-[20px]">
          <div class="move " @click="moveHandler('left')">
            <el-icon size="20">
              <ArrowLeft />
            </el-icon>
          </div>

          <div class="move" @click="moveHandler('right')">
            <el-icon size="20">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <div ref="content" class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const content = ref<HTMLDivElement>()

const moveHandler = (direction: 'left' | 'right') => {
  const el = content.value
  if (!el) return

  const item = el.children[0] as HTMLElement
  if (!item) return

  const gap = 20
  const itemWidth = (item.offsetWidth + gap) * 3

  el.scrollBy({
    left: direction === 'right' ? itemWidth : -itemWidth,
    behavior: 'smooth'
  })
}
</script>

<style scoped lang="scss">
.move {
  .el-icon {
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    width: 27px;
    height: 37px;
    font-weight: 800;
  }
}

.content {
  display: flex;
  overflow-x: auto;
  gap: 20px;

  scroll-snap-type: x mandatory;
}

.content::-webkit-scrollbar {
  display: none;
}

.content>* {
  scroll-snap-align: start;
  flex-shrink: 0;
}
</style>
