<template>
  <div class="center">
    <div class="cut-container flex items-center justify-center">
      <svg @click="emit('setOrderHandler')" style="width: 20px"
        :class="['icon', 'iconfont', props.orderStatus[orderStatusVal]]" aria-hidden="true">
        <use :xlink:href="'#' + props.orderStatus[orderStatusVal]"></use>
      </svg>
      <i class="iconfont cut icon-shangyishou" @click="emit('cutSong', false)"></i>
      <i v-show="isPlay" @click="emit('pause')" class="iconfont operation icon-Pause"></i>
      <i v-show="!isPlay" @click="emit('play')" class="iconfont operation icon-kaishi1"></i>
      <i class="iconfont cut icon-xiayishou" @click="emit('cutSong', true)"></i>
    </div>
  </div>

</template>

<script setup lang="ts">

interface Props {
  orderStatus: string[],
  orderStatusVal: number,
  isPlay: boolean
}

const props = defineProps<Props>()
interface Emits {
  (e: 'setOrderHandler'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e:'cutSong', type: boolean): void
}
const emit = defineEmits<Emits>()

</script>

<style scoped lang="scss">
.center {
  color: rgb(212, 212, 212);
  width: 441px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  svg {
    fill: currentColor; // 让 svg 使用 color
  }

  .cut-container {
    //width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon-xihuan5 {
      font-size: 22px !important;
    }

    .icon {
      font-size: 18px;
    }

    .iconfont {
      cursor: pointer;
    }

    .iconfont+.iconfont {
      margin-left: 35px;
    }

    .iconfont:not(.operation):hover {
      color: rgb(194, 58, 59);
    }

    .operation:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .cut {
      font-size: 18px;
    }

    .operation {
      color: $text;
      font-size: 18px;
      display: inline-block;
      width: 37px;
      line-height: 37px;
      text-align: center;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.05);

      &::before {
        margin-left: 3px;
      }
    }

    .icon-Pause {
      font-size: 16px;

      &::before {
        margin-left: 1px;
      }
    }
  }
}
</style>
