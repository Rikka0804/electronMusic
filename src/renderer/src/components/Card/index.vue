<template>
  <div class="card-box inline-block rounded cursor-pointer">
    <div class="card w-full rounded"
      :style="{ backgroundImage: `url(${props.picUrl}?param=400y400` }">
      <div class="start-icon-box">
        <i class="iconfont operation icon-kaishi1"></i>
      </div>
      <span class="playCount" v-if="playCount">
        <el-icon class="mr-[5px]">
          <Headset />
        </el-icon>
        {{ formatNumberToMillion(props.playCount!) }}
      </span>
    </div>
    <span class="cardName"> {{ props.name }}</span>
    <span class="musicCount" v-if="trackCount">{{ props.trackCount }} 首</span>
    <div>

    </div>
  </div>

</template>

<script lang="ts" setup>
import { formatNumberToMillion } from '@/utils/utils'
interface Props {
  picUrl: string
  name: string
  trackCount?: number
  playCount?: number
}

const props = defineProps<Props>()



</script>

<style scoped lang="scss">
.card-box {
  --card-size: 200px;
  --card-play-button-size: 48px;
  --card-play-icon-size: 22px;
  width: var(--card-size);
  max-width: 100%;

  &:hover {
    .card .start-icon-box {
      visibility: visible;
      opacity: 0.8;
    }

    box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.5);
  }

  .card {
    height: var(--card-size);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: 0.3s;
    position: relative;

    .start-icon-box {
      position: absolute;
      bottom: 10px;
      width: var(--card-play-button-size);
      height: var(--card-play-button-size);
      right: 10px;
      border-radius: 50%;
      background-color: rgb(255, 255, 255);
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.5s;
      visibility: hidden;

      .icon-kaishi1 {
        color: $subject;
        font-size: var(--card-play-icon-size);
      }
    }

    .playCount {
      display: flex;
      align-items: center;
      position: absolute;
      color: white;
      right: 10px;
      top: 8px;
      font-size: 15px;
    }
  }

  .cardName {
    padding: 0 5px;
    margin-top: 5px;
    color: $text;
    font-size: 14px;
    @include textOverflow(1);
  }

  .musicCount {
    padding: 0 5px;
    color: $text;
    font-size: 12px;
    margin-bottom: 5px;
  }
}
</style>
