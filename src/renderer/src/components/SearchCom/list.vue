<template>
  <div class="search-list h-full overflow-hidden py-[20px] px-[10px]">
    <template v-if="model === 'hot'">
      <div class="hot-list">
        <div class="hot-title mb-[10px]">
          热搜
        </div>
        <div class="hot-list-item flex items-center cursor-pointer h-[60px]" v-for="(item, index) in props.list"
          :key="index" @mousedown.prevent="handleSearch(item.searchWord)">
          <div class="item-index mr-[20px]" :class="{ 'top3': index < 3 }">
            {{ index + 1 }}
          </div>
          <div class="item-content">
            <div class="title flex items-center">
              <span class="name font-[600] text-[14px] mr-[5px]">
                {{ item.searchWord }}
              </span>
              <img v-if="item.iconUrl" :src="item.iconUrl" class="icon size-[15px]">
            </div>
            <div class="desc text-[11px] ">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="keyWords-list">
        <div class="keyWords-item flex items-center cursor-pointer h-[60px]" v-for="(item, index) in props.keywordsList"
          :key="index" @mousedown.prevent="handleSearch(item.keyword)">
          <el-icon size="14px" class="mr-[5px]">
            <Search />
          </el-icon>
          <span class="font-[600] text-[14px] mr-[10px]" v-html="item.text">

          </span>
          <span style="color:red; " class="text-[14px]" v-if="item.alg.includes('Like')">
            ❤
          </span>
        </div>
      </div>

    </template>


  </div>

</template>

<script setup lang="ts">
import type { searchSongItem, searchSongAllMatchItem } from '@/types/search'
interface Props {
  list: searchSongItem[],
  keywordsList: searchSongAllMatchItem[],
  model: 'hot' | 'keywords'
}
const props = defineProps<Props>()
interface Emits {
  (e: 'select', keywords: string): void

}
const emit = defineEmits<Emits>()
const handleSearch = (keywords: string) => {
  emit('select', keywords)
}

</script>

<style scoped lang="scss">
.search-list {
  .hot-list {
    .hot-list-item {
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .item-index {
        color: rgb(150, 150, 150);

        &.top3 {
          color: red;
        }
      }

      .item-content {
        .desc {
          color: rgba(150, 150, 150, 0.60);
        }

      }

    }


  }

  .keyWords-list {
    .keyWords-item {
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>
