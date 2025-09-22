<template>
  <div class="login-box">
    <el-dialog v-model="loginVis" title="登录" width="500" height="500" :before-close="handleClose">
      <div class="flex justify-center p-4">
        <img :src="qrimgUrl" alt="登录二维码" class="qr-code" v-if="qrimgUrl">
        <p v-else>加载二维码中...</p>
      </div>
      <div v-if="loginStatus" class="text-center text-blue-500">
        {{ loginStatus }}
      </div>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import { getQrKeyApi, createQrApi, checkQrApi } from '@/api/login'
import { ref, defineEmits } from 'vue'
import { useUserStore } from '@/store';

let qrimgUrl = ref('')
// 轮询定时器ID
let pollTimer: number | null = null
// 登录状态提示
const loginStatus = ref('')
const getQrImg = async () => {
  if (pollTimer) {
    clearInterval(pollTimer)
  }
  const { data } = await getQrKeyApi()
  const key = data.unikey

  const { data: { qrimg } } = await createQrApi({
    key,
    qrimg: true
  })
  qrimgUrl.value = qrimg
  loginStatus.value = '请使用手机扫描二维码登录'
  startPolling(key)
}
// 开始轮询检查登录状态
const startPolling = (key: string) => {
  // 每3秒检查一次
  pollTimer = window.setInterval(async () => {
    try {
      const res = await checkQrApi({ key, noCookie: true })

      // 根据接口返回的状态码处理
      // 注意：这里的状态码需要根据实际接口返回进行调整
      switch (res.code) {
        case 800:
          // 二维码已过期，重新获取
          loginStatus.value = '二维码已过期，正在刷新...'
          clearInterval(pollTimer!)
          setTimeout(getQrImg, 1000)
          break
        case 801:
          // 等待扫码
          loginStatus.value = '请扫描二维码'
          break
        case 802:
          // 已扫码，等待确认
          loginStatus.value = '已扫描，请在手机上确认'
          break
        case 803:
          // 登录成功
          loginStatus.value = '登录成功，正在跳转...'
          clearInterval(pollTimer!)
          useUserStore().setCookie(res.cookie)
          handleClose() // 关闭登录框
          break
        default:
          // 其他状态
          loginStatus.value = '登录过程中出现异常'
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      loginStatus.value = '检查登录状态失败'
      clearInterval(pollTimer!)
    }
  }, 3000)
}

const loginVis = ref(false)

const handleOpen = async () => {

  loginVis.value = true
  await getQrImg()
}
interface Emits {
  (e: 'closeLogin'): void
}
const emit = defineEmits<Emits>()
const handleClose = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
  }
  loginVis.value = false
  emit('closeLogin')
}


defineExpose({
  handleOpen
})




</script>

<style scoped lang="scss">
.qr-code {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
