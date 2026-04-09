<template>
  <div class="searchContainer mb-[10px]">
    <div class="item-title cursor-pointer text-[18px] font-bold mb-[10px] flex items-center w-fit" @click="emit('clickTitle', props.tab)">
      {{ props.title }}
      <el-icon class="ml-[5px]">
        <ArrowRightBold />
      </el-icon>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  tab: 'music' | 'musicList' | 'singer'
}
const props = defineProps<Props>()

interface Emits {
   (e: 'clickTitle' ,type: Props['tab']): void
}
const emit = defineEmits<Emits>()

</script>

<style scoped lang="scss"></style>
