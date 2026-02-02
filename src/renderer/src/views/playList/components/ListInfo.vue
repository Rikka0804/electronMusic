<template>
  <div class="listInfo flex" v-if="!props.loading && musicStore.currentItem?.coverImgUrl">
    <div class="left bgSetting mr-[20px]" ref="left">
      <span class="count">
        <el-icon class="mr-[5px]">
          <Headset />
        </el-icon>
        {{ formatNumberToMillion(musicStore.currentItem.playCount!) }}
      </span>
    </div>
    <div class="right h-[180px] flex flex-col">
      <div class="listName">
        {{ musicStore.currentItem.name }}
      </div>
      <div class="listDescription text-[15px]" v-if="musicStore.currentItem.description">
        {{ musicStore.currentItem.description }}
      </div>
      <div class="listInfo flex items-center">
        <div class="createPerson flex cursor-pointer items-center mr-[15px]"
          @click="wentUserInfo(musicStore.currentItem.userId)">
          <div class="avator bgSetting rounded-full size-[25px] mr-[10px]"
            :style="{ backgroundImage: `url(${musicStore.currentItem.creator.avatarUrl})` }">
          </div>
          <div class="nickName text-[15px]">
            {{ musicStore.currentItem.creator.nickname }}
          </div>
        </div>
        <div class="createTime">
          {{ formatDate(musicStore.currentItem.createTime!, 'YYYY-MM-DD') }} 创建
        </div>
      </div>
      <div class="listButton mt-auto">
        <el-button type="danger" style="width: 100px;" @click="playAllHandler">▶ 播放全部</el-button>
        <el-button type="info" title="收藏" style="width: 100px;"
          v-if="userStore.userInfo?.profile.userId !== musicStore.currentItem.userId && !musicStore.currentItem.subscribed">
          <el-icon size="18px" class="mr-[5px]">
            <Star />
          </el-icon>
          {{ formatNumberToMillion(musicStore.currentItem.subscribedCount) }}
        </el-button>
        <el-button type="info" title="取消收藏" style="width: 100px;"
          v-if="userStore.userInfo?.profile.userId !== musicStore.currentItem.userId && musicStore.currentItem.subscribed">
          <el-icon size="18px" class="mr-[5px]" style="color: yellow;">
            <StarFilled />
          </el-icon>
          {{ formatNumberToMillion(musicStore.currentItem.subscribedCount) }}
        </el-button>
        <el-button type="info" title="下载" style="width: 100px;">
          <el-icon size="18px" class="mr-[5px]">
            <Download />
          </el-icon>
          下载
        </el-button>
      </div>
    </div>

  </div>
  <div class=" h-[180px]" v-else v-loading="props.loading">
  </div>


</template>

<script setup lang="ts">
import { useMusicStore, useUserStore, useThemeStore } from '@/store/index';
import { toggleImg, formatNumberToMillion, formatDate } from '@/utils/utils';
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';
const musicStore = useMusicStore()
const userStore = useUserStore()
const themeStore = useThemeStore()
const left = ref<HTMLDivElement>()
interface Props {
  loading: boolean
}
const props = defineProps<Props>()

watch(() => musicStore.currentItem, (val) => {
  if (val?.coverImgUrl) {
    toggleImg(val.coverImgUrl, '350y350').then(img => {
      if (left.value) left.value.style.backgroundImage = `url(${img.src})`
    })
    themeStore.change(val.coverImgUrl)
  }
}, { immediate: true })

interface Emits {

  (e: 'playAll'): void
}
const emit = defineEmits<Emits>()
const playAllHandler = () => {
  emit('playAll')
}




const router = useRouter()
const wentUserInfo = (id: number) => {
  router.push({
    path: '/userInfo',
    query: {
      uid: id,
      type: userStore.userInfo?.profile.userId === musicStore.currentItem?.userId ? 'my' : 'other'
    }
  })

}

</script>

<style scoped lang="scss">
.left {
  width: 180px;
  height: 180px;
  border-radius: 10px;
  position: relative;

  .count {
    color: white;
    position: absolute;
    right: 10px;
    top: 8px;
    font-size: 15px;
    display: flex;
    align-items: center;
  }
}

.right {
  >div {
    margin-bottom: 10px;
  }

  >div:last-child {
    margin-bottom: 0;
  }

  .listName {
    color: white;
    font-size: 22px;
  }

  .listDescription {
    @include textOverflow
  }

  .listInfo {
    .createTime {
      color: $darkText
    }
  }
}
</style>
