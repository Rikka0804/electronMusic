<template>
  <el-drawer v-model="drawer" direction="rtl" class="music-drawer" :with-header="false" body-class="music-drawer-body">
    <div class="drawer-head flex justify-between items-center">
      <div class="drawer-head-title">
        <span class="title-text text-[20px]">播放列表</span>
        <span class="drawer-count">{{ Array.isArray(musicStore.runtimeList?.tracks)
          ? musicStore.runtimeList.tracks.length
          : 0 }}</span>
      </div>
      <div class="drawer-head-clean text-[15px] flex items-center cursor-pointer">
        <el-icon class="mr-[5px]">
          <Delete />
        </el-icon>
        清空
      </div>
    </div>
    <div class="drawer-list flex-1 overflow-auto">
      <MusicList :columns="drawerColumns" :list="musicStore.runtimeList?.tracks || []" :needSearch="false"
        :needTitle="false" />
    </div>
  </el-drawer>

</template>

<script lang="ts" setup>
import { useMusicStore } from '@/store';
import { computed } from 'vue'
import MusicList from '@/views/playList/components/MusicList.vue';
import { drawerColumns } from '@/views/playList/musciList';

const musicStore = useMusicStore()

const drawer = computed({
  get() {

    return musicStore.drawerShow

  },
  set(val) {
    musicStore.drawerShow = val

  }
})




</script>

<style lang="scss">
.music-drawer {
  width: 35% !important;
  height: 75% !important;
  top: 10% !important;
  border-radius: 10px 0 0 10px;
  background-color: rgba(40, 40, 40, 0.7);


  .music-drawer-body {
    padding: 0;
    display: flex;
    flex-direction: column;

    .drawer-head {
      padding: 15px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);

      .drawer-head-title {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .drawer-head-clean {}

      .drawer-count {
        opacity: 0.8;
      }

    }
  }
}
</style>
