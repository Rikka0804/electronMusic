<template>
  <div class="musicList mt-[15px]">
    <div class="search">
      <el-input prefix-icon="Search" clearable placeholder="搜索" v-model="searchKey" @focus="isFocus = true"
        @blur="isFocus = false" :class="{ active: isFocus || searchKey }" />
    </div>
    <div class="list mt-[15px]">
      <div class="list-title ">
        <div v-for="config in columns" v-show="!config.hidden" :key="config.title" class="title-item"
          :class="config.class" :style="{ ...config.style, width: config.width }">
          {{ config.title }}
        </div>
      </div>
      <div class="list-container">
        <div class="musciList-item" v-for="(value, index) in mylist" :key="value.id">
          <div class="item-container flex text-[14px] h-[70px] items-center justify-around">
            <div v-for="config in columns" :key="config.type" :class="config.class"
              :style="{ ...config.style, width: config.width }">
              <template v-if="config.type === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="config.type === 'time'">
                {{ value._duration }}
              </template>
              <template v-if="config.type === 'handle'">
                <i v-for="val in config.icon" :key="val" class="iconfont cursor-pointer" :class="{
                  'icon-xihuan1': val === 'love' && isLike(value),
                  'icon-xihuan': val === 'love' && !isLike(value)
                }" />
              </template>
              <template v-if="config.type === 'title'">
                <div class="title-box  flex">
                  <el-image lazy style="width: 50px; height: 50px" :src="value.al.picUrl + '?param=150y150'"
                    class="title-img" />
                  <div class="title-info ml-[10px] flex flex-col justify-between flex-1">
                    <div class="title-name">{{ value.name }}</div>
                    <div class="title-artist"> <span v-for="(ar, index) in value.ar" :key="ar.id || index" :style="{
                      cursor: ar.id ? 'pointer' : 'default',
                      color: ar.id ? '' : 'rgba(150, 150, 150, 0.60)'
                    }">
                        {{ ar.name || '未知歌手' }}
                        <span v-if="index < value.ar.length - 1" style="color: #969696"> / </span>
                      </span></div>
                  </div>
                </div>
              </template>
              <template v-if="config.type === 'album'">
                <div class="album-name">{{ value.al.name || '未知专辑' }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref ,computed} from 'vue'
import { formattingTime } from '@/utils/utils'
import { type Columns } from '../musciList'
import { GetMusicDetailData } from '@/types/musicList'
import { useUserStore } from '@/store/modules/user'
interface props {
  columns: Columns[],
  list: GetMusicDetailData[]


}
const props = defineProps<props>()
const mylist = ref<GetMusicDetailData[]>([])
mylist.value = props.list.map(item => ({
  ...item,
  _duration: formattingTime(item.dt)
}))

const searchKey = ref('')
const isFocus = ref(false)
const userStore = useUserStore()
const likeSet = computed(() => new Set(userStore.userLikeIds))
const isLike = (data: GetMusicDetailData) => likeSet.value.has(data.id)


</script>

<style scoped lang="scss">
::v-deep(.iconfont.icon-xihuan1) {
  color: #ff6600;
}
.search {
  display: flex;
  justify-content: flex-start;
  transition: all 0.3s ease;


  .el-input {
    width: 80px;
    transition: width 0.3s ease;

    &.active {
      width: 180px;
    }

    ::v-deep(.el-input__wrapper) {
      border-radius: 50px;
      transition: all 0.3s ease;

      border: none;

      &.is-focus {
        box-shadow: none;
      }
    }
  }
}
.list{
.empty{
  margin-left: 20px;
}
}

.list-title {
  display: flex;
  font-size: 14px;
  height: 35px;
  color: $darkText;
  justify-content: space-around;

  .title-item {
    text-align: left;
  }

  .title-item.title {
    color: $darkText;
  }
}

.list-container {
  .musciList-item {
    .item-container {
      color: $darkText;
      border-radius: 10px;

      &.active {
        background-color: rgba(255, 255, 255, 0.05);
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }

      .title-box {
        width: 90%;
        .title-img {
          border-radius: 10px;
        }

        .title-info {

          .title-name {
            @include textOverflow(1);
            font-size: 15px;
            font-weight: bold;
          }

          .title-artist {
            @include textOverflow(1);
            font-size: 13px;
            color: rgba(150, 150, 150, 0.60);
          }
        }

      }

      .album-name {
        width: 90%;
        @include textOverflow(1);
      }
    }
  }
}
</style>
