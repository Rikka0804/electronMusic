<template>
  <div class="userCard flex  w-[87vw-180px]">
    <div class="userAvator">
      <el-avatar :size="180" :src="userInfo?.avatarUrl" />
    </div>
    <div class="userInfo flex-1 ml-[20px] flex flex-col justify-center">
      <div class="userName text-[25px] ">
        {{ userInfo?.nickname }}
      </div>
      <div class="levelAndCreateDays flex items-center text-[14px]">
        <div class="level mr-[15px] ">
          Lv.{{ userInfo?.level }}
        </div>
        <div class="createDays">
          注册天数：{{ userInfo?.createDays }}天
        </div>
      </div>
      <div class="addressInfo flex text-[14px] ">
        地区：
        <div class="province mr-[5px]">
          {{ provinceName }}
        </div>
        <div class="city">
          {{ cityName }}
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { province, city } from 'province-city-china/data'
import { useUserStore } from '@/store'
const userStore = useUserStore()
const userInfo = userStore.userInfo?.profile

const provinceName = province.find(item => item.code == userInfo?.province)?.name
const cityName = city.find(item => item.code == userInfo?.city)?.name



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
    * {
      margin-bottom: 10px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .levelAndCreateDays {
      .level {
        color: $bgColor;
        background-color: rgb(240, 240, 240);
        padding: 1px 7px;
        border-radius: 10px;
      }

    }
  }
}
</style>
