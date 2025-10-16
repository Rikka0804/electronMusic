<template>
   <el-tabs v-bind="$attrs" class="bass-tabs" v-model="activeName">
    <el-tab-pane v-for="(item, index) in props.list" :key="index" :label="item.label" :name="item.name">

    </el-tab-pane>
   </el-tabs>


</template>

<script lang="ts" setup name="Tabs" >
import { ref } from 'vue'
import { listItem , list } from '@/views/userInfo/config'

const activeName = ref(list[0].name)

interface Props {
  list: listItem[]
}
defineOptions({
  name: 'Tabs'
})
const props = defineProps<Props>()

</script>

<style lang="scss">
.bass-tabs.el-tabs {
  .el-tabs__active-bar {
    background-color: $subject;
    transition: 0.3s ease !important;
  }
  .el-tabs__item.is-active {
    font-size: 18px !important;
    color: white !important;
    font-weight: 800;
  }
  .el-tabs__content {
    overflow: inherit;
  }
  .el-tabs__item {
    color: $darkText;
    font-size: 16px;
    transition: font-size 0.1s;
  }
  .el-tabs__nav-wrap::after {
    content: none;
  }

  .el-tabs__content {
    padding-top: 20px;
    text-align: left;
  }
}

</style>
