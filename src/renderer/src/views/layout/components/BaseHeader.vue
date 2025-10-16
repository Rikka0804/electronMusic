<template>
  <div class="h-[15px] drag"></div>
  <div class="header h-[60px] w-full flex justify-between">
    <div class="left h-full flex items-center">
      <div class="flip pr-[15px]">
        <el-icon @click="back" :class="{ disable: flags.count === 0 }">
          <ArrowLeft />
        </el-icon>
      </div>
      <SearchCom></SearchCom>
    </div>
    <div class="center"></div>
    <div class="right">
      <div class="operator">
        <div class="handler">
          <el-icon size="20">
            <Setting />
          </el-icon>
        </div>
        <div class="handler" @click="minimize">
          <i class="iconfont icon-weibiaoti-"></i>
        </div>
        <div class="handler" @click="maximizeOrUnmaximize">
          <i :class="['iconfont', flags.isMaximize ? 'icon-3zuidahua-3' : 'icon-3zuidahua-1']"></i>
        </div>
        <div style="margin-right: 13px" class="handler" @click="close">
          <i class="iconfont icon-guanbi"></i>
        </div>

      </div>
    </div>

  </div>

</template>

<script setup lang="ts">
import SearchCom from '@/components/SearchCom/index.vue';
import { useRouter } from 'vue-router'
import { useFlags } from '@/store';
import { handle } from './headerConfig'
const router = useRouter()
const flags = useFlags()
const { maximize, unmaximize, minimize, close } = handle()
const maximizeOrUnmaximize = () => {
  flags.isMaximize ? unmaximize() : maximize()
}
const back = () => {

  router.back()
}

</script>

<style scoped lang="scss">
.header {
  .left {
    .flip {
      .el-icon {
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        width: 27px;
        height: 37px;
        font-weight: 800;
      }

      .disable.el-icon {
        cursor: default;

        color: rgba(150, 150, 150, 0.60);
      }
    }
  }

  .right {
    .operator {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 2006;

      .handler {
        display: flex;
        margin-right: 20px;
        cursor: pointer;

        &:hover {
          color: rgb(30, 204, 148);
        }
      }

      .iconfont.icon-weibiaoti- {
        font-size: 25px;
      }

      .iconfont.icon-guanbi {
        font-size: 14px;
      }

      .iconfont.icon-3zuidahua-1 {
        font-size: 14px;
      }
    }

  }
}
</style>
