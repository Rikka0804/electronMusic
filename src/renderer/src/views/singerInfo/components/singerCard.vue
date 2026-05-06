<template>
  <div class="userCard flex  w-[87vw-180px]" v-loading="loading" element-loading-background="transparent">
    <div class="userAvator">
      <el-avatar :size="180" :src="props.userInfo?.img1v1Url" />
    </div>
    <div class="userInfo flex-1 ml-[20px] flex flex-col justify-center">
      <div class="userName text-[25px] ">
        {{ props.userInfo?.name }}
      </div>
      <div class="levelAndCreateDays flex items-center text-[14px]">
        <div class="level mr-[15px] " v-if="props.userInfo?.alias && props.userInfo?.alias.length > 0">
          {{ props.userInfo?.alias.join('/') }}
        </div>
        <div class="personPage " v-if="props.userInfo?.accountId">
          <el-button link type="plain" @click="handleClick">
            个人页>
          </el-button>
        </div>

      </div>
      <div class="listButton mt-auto">
        <el-button type="danger" @click="playAllHandler">▶ 播放全部</el-button>
      </div>
    </div>

  </div>

</template>

<script lang="ts" setup>

import { singerInfo } from '@/types/search'
import { useRouter } from 'vue-router';

interface Props {
  userInfo: singerInfo | undefined,
  loading: boolean,
}
const props = defineProps<Props>()
interface Emits {

  (e: 'playAll'): void
}
const emit = defineEmits<Emits>()
const router = useRouter()
const handleClick = () => {
  router.push({
    path: '/userInfo',
    query: {
      uid: props.userInfo?.accountId,

    }
  })
}

const playAllHandler = () => {
  emit('playAll')
}


</script>

<style scoped lang="scss">
.userCard {
  background-color: rgba(255, 255, 255, .05);
  padding: 20px;
  border-radius: 20px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.1);
  transition: 0.4s;

  .userInfo {
    >*:not(:last-child) {
      margin-bottom: 10px;
    }

    .levelAndCreateDays {
      .level {
        color: $bgColor;
        background-color: rgb(240, 240, 240);
        padding: 1px 7px;
        border-radius: 10px;
      }

      .personPage {
        button {
          color: rgb(210, 210, 210)
        }

      }


    }
  }
}
</style>
