<template>
  <div class="left flex items-center w-[25%]">
    <div class="picture-box w-[65px] h-[65px] overflow-hidden cursor-pointer relative">
      <div :style="{ backgroundImage: `url(${props.songs?.al?.picUrl + '?param=150y150'})` }"
        class="picture bgSetting h-full w-full "></div>
      <div class="shade-box"></div>
      <el-icon :size="25" class="close np-drag">
        <ArrowDown />
      </el-icon>
    </div>
    <div class="name-info">
      <div class="name">{{ props.songs?.name }}</div>
      <div class="artist">{{props.songs?.ar?.map((item) => item.name).join('/')}}</div>
    </div>
    <i v-if="isLike" class="iconfont icon-xihuan1"></i>
    <i v-else class="iconfont icon-xihuan"></i>

  </div>


</template>

<script setup lang="ts">
import { GetMusicDetailData } from '@/types/musicList'
import { useUserStore } from '@/store'
import { computed } from 'vue'

interface Props {
  songs?: GetMusicDetailData
}

const props = defineProps<Props>()

const userStore = useUserStore()

const isLike = computed(() => {
  return userStore.userLikeIds.includes(props.songs?.id as number)
})

</script>

<style scoped lang="scss">
.left {
  color: $text;

  .iconfont {
    cursor: pointer;
    margin-left: 8px;
  }

  .icon-xihuan {
    color: $darkText;
    font-size: 22px;
  }

  .icon-xihuan1 {
    font-size: 21px;
    color: rgb(235, 65, 65);
  }

  .picture-box {
    border-radius: 10px;

    .picture {
      transition: .5s;
    }

    .shade-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      transition: 0.5s;
    }

    .close {
      visibility: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      transition: 0.5s;
      opacity: 0;
      transform: rotateX(-180deg) translateY(50%) translateX(-50%);
    }

    &:hover {
      .picture {
        filter: blur(1.5px);
      }

      .shade-box {
        background-color: rgba(0, 0, 0, .3);
      }

      .close {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .name-info {
    margin-left: 10px;

    .name {
      max-width: 150px;
      @include textOverflow(1);
      font-size: 16px;
      font-weight: bold;
    }

    .artist {
      max-width: 150px;
      @include textOverflow(1);
      font-size: 14px;
    }
  }
}
</style>
