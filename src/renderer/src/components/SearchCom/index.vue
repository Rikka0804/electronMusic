<template>
  <div class="search-container flex items-center px-[15px]">
    <el-icon class="search-icon cursor-pointer" size="18px" color="rgba(255, 255, 255, 0.5)">
      <Search />
    </el-icon>
    <input
      class="search-input bg-transparent w-[230px] h-[37px] pl-[10px] outline-none border-none font-size-[14px] text-white placeholder:text-white/50"
      type="text" :placeholder="placeholderInfo.showKeyword" v-model.trim="keywords" @focus="focusHandler"
      @blur="blurHandler" @keyup.enter="handleSearch('enter')" />
    <el-icon class="clean-icon cursor-pointer" size="18px" color="rgba(255, 255, 255, 0.5)"
      :class="{ visible: keywords }" @click="keywords = ''">
      <CircleCloseFilled />
    </el-icon>
    <div class="suggest app-scrollbar" v-show="showSuggest" v-loading="loading" element-loading-background="transparent">
      <list :list="state.list" :model="model" :keywordsList="state.keywordsList" @select="handleSearch('click',$event)"/>
    </div>
  </div>

</template>

<script lang="ts" setup>
import list from './list.vue';
import { getDefaultSearchApi, getHotSearchApi, getSearchSuggestApi } from '@/api/search'
import type { searchSongItem, searchSongAllMatchItem } from '@/types/search'
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
// 搜索关键词
const keywords = ref('')

// 默认搜索词
const placeholderInfo = ref({
  realkeyword: '',
  showKeyword: '',
})

// 获取默认搜索
const getDefaultSearch = async () => {
  const { data } = await getDefaultSearchApi()
  placeholderInfo.value.realkeyword = data.realkeyword
  placeholderInfo.value.showKeyword = data.showKeyword

}
getDefaultSearch()

const focusHandler = () => {
  showSuggest.value = true
}
const blurHandler = () => {
  showSuggest.value = false
}

// 高亮元素
const hightLight = (obj: searchSongAllMatchItem[]) => {
  const regExp = new RegExp(keywords.value, 'ig')
  obj.forEach(item => {
    item.text = item.keyword.replace(regExp, (match) => {
      return `<span style="color:lightskyblue">${match}</span>`
    })
  })
}



// 搜索建议
const loading = ref(false)
let timer: NodeJS.Timeout | null = null
watch(keywords, (newVal) => {
  if (newVal) {
    model.value = 'keywords'
    if (timer) clearTimeout(timer)

    timer = setTimeout(async () => {
      loading.value = true
      const { result: { allMatch } } = await getSearchSuggestApi(keywords.value, 'mobile')
      loading.value = false
      hightLight(allMatch)
      state.keywordsList = allMatch
      timer = null
    }, 1500)
  } else {
    model.value = 'hot'
    state.keywordsList = []
  }
})

// 搜索列表数据
const model = ref<'hot' | 'keywords'>("hot")
interface State {
  list: searchSongItem[]
  keywordsList: searchSongAllMatchItem[]
}
const state = reactive<State>({
  list: [],
  keywordsList: []
})
const getHotSearch = async () => {
  const { data } = await getHotSearchApi()
  state.list = data


}
getHotSearch()
const showSuggest = ref(false)

// 搜索
const router = useRouter()
const handleSearch = (type: 'enter' | 'click', selectKeywords?: string) => {
  showSuggest.value = false
  const targetKeywords = type === 'enter'
    ? (keywords.value || placeholderInfo.value.showKeyword)
    : (selectKeywords || keywords.value || placeholderInfo.value.showKeyword)

  keywords.value = targetKeywords

  router.push({
    path: '/search',
    query: {
      keywords: targetKeywords
    }
  })
}



</script>

<style scoped lang="scss">
.search-container {
  position: relative;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .clean-icon {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }


  &:hover {
    .clean-icon.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .suggest {
    position: absolute;
    border-radius: 10px;
    width: 380px;
    max-height: 77vh;
    background-color: rgba(45, 45, 56, 1);
    transform: translateX(-50%) translateY(100%);
    left: 50%;
    bottom: -2vh;
    z-index: 10;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;

    //backdrop-filter: blur(60px) saturate(210%);

  }
}
</style>
