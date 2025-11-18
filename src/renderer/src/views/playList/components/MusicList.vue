<template>
  <div class="musicList mt-[15px]">
    <div class="search">
      <el-input
        prefix-icon="Search"
        clearable
        placeholder="搜索"
        v-model="searchKey"
        @focus="isFocus = true"
        @blur="isFocus = false"
        :class="{ active: isFocus || searchKey }"
      />
    </div>
    <div class="list mt-[15px]">

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchKey = ref('')
const isFocus = ref(false)
</script>

<style scoped lang="scss">
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
</style>
