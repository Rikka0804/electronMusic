# 播放器与 musicStore 改造技术方案

## 背景

当前项目已经有底部播放器、播放队列、歌词、进度条、抽屉播放列表等功能。现有实现可以运行，但播放器控制能力主要通过 `window.$audio` 暴露组件实例给全局使用，`musicStore`、`ProgressBar`、`MusicList` 等模块都直接调用 `$audio`。

这会带来几个问题：

- `musicStore` 依赖 DOM 播放器实例，业务层和视图层耦合。
- 调用点分散，播放、暂停、seek、切歌逻辑不容易统一维护。
- `MusicPlayer` 重写原生 `audio.play` / `audio.pause`，可读性和调试体验较差。
- 后续接入歌词详情页、快捷键、MediaSession、歌词同步时，状态流会更复杂。
- 全量性能优化前，播放器架构边界还不够稳定。

本方案目标是先把播放器控制层和业务状态层理顺，再做性能优化和歌词详情页扩展。

## 总体结论

推荐改造方向：

```text
不要继续把组件实例挂到 window.$audio 作为主要调用方式。

改为：
audioController
  负责 HTMLAudioElement 控制：play、pause、seek、reset、fade、事件读取

musicStore
  负责业务状态和业务动作：播放歌曲、暂停、切换、进度、队列、歌词、动态封面

MusicPlayer.vue
  负责 UI 和 audio 元素挂载，不再承载全局业务入口
```

迁移时不要一次性删除 `$audio`。第一阶段先保留兼容，等调用点全部替换后再移除。

## 当前主要问题

### 1. store 直接依赖 window.$audio

当前 `src/renderer/src/store/modules/music.ts` 中有类似调用：

```ts
await window.$audio.pause(false)
window.$audio.reset()
const el = window.$audio?.el
```

问题：

- Pinia store 变成依赖浏览器 DOM 和播放器组件实例。
- store 难以测试。
- 如果播放器组件还没挂载，调用有空指针风险。
- 未来如果播放器组件拆分或重构，store 会跟着受影响。

### 2. 多个组件直接调用 window.$audio

例如：

```ts
window.$audio.togglePlay()
window.$audio.time = tempTime.value
```

问题：

- 播放动作分散在组件里。
- 很难统一处理播放状态、异常、歌词同步、MediaSession。
- 组件知道了播放器底层实现细节。

### 3. 重写原生 audio.play / audio.pause

当前 `MusicPlayer/index.vue` 中会将原生方法替换成业务方法：

```ts
audio.value!.play = play
audio.value!.pause = pause
```

问题：

- `audio.play()` 不再是原生语义，阅读和调试都容易误解。
- 第三方逻辑或浏览器行为可能预期它是原生 Promise 语义。
- 后续接歌词库或 MediaSession 时，容易混淆“原生播放”和“业务播放”。

### 4. currentTime 更新路径绕远

播放器组件内部已经有 `audio.value`，但 `timeupdate` 中还读：

```ts
window.$audio.el.duration
window.$audio.time
```

这会让组件内部逻辑依赖全局实例，反而绕了一圈。

### 5. musicStore 职责过多

当前 store 混合了：

- 当前歌单。
- 播放队列。
- 播放控制。
- 播放模式。
- 随机播放历史。
- 歌词请求与解析。
- 动态封面。
- 音乐抽屉显示。

短期不一定要拆成多个 store，但需要按业务域重新组织。

## 目标架构

```text
src/renderer/src/services/audioController.ts
  纯播放器控制服务，不依赖 Vue 组件实例

src/renderer/src/store/modules/music.ts
  业务状态和业务动作入口

src/renderer/src/components/MusicPlayer/index.vue
  audio 元素、底部播放器 UI、audio 事件上报

src/renderer/src/components/MusicPlayer/ProgressBar.vue
  只调用 musicStore.seekTo，不直接操作 audio

src/renderer/src/views/playList/components/MusicList.vue
  只调用 musicStore.togglePlayback / playSong，不直接操作 audio
```

调用流：

```text
用户点击播放按钮
  -> musicStore.togglePlayback()
  -> audioController.playAudio() / pauseAudio()
  -> audio 事件更新 isPlay / currentTime

用户拖动进度条
  -> musicStore.seekTo(time)
  -> audioController.seekAudio(time)
  -> musicStore.currentTime = time

用户播放某首歌
  -> musicStore.playSong(song, index)
  -> 请求 URL / 歌词 / 动态封面
  -> 更新 musicUrl / songs / currentIndex
  -> audioController.resetAudio()
  -> audio canplay 后播放
```

## audioController 设计

新增文件：

```text
src/renderer/src/services/audioController.ts
```

职责：

- 注册真实 `HTMLAudioElement`。
- 提供播放、暂停、seek、reset。
- 提供音量淡入淡出。
- 提供读取当前时间、时长、播放状态的方法。
- 不关心歌曲、队列、歌词等业务。

示例设计：

```ts
let audioElement: HTMLAudioElement | null = null
let fadeTimer: ReturnType<typeof window.setInterval> | null = null

export function registerAudioElement(element: HTMLAudioElement) {
  audioElement = element
}

export function unregisterAudioElement(element: HTMLAudioElement) {
  if (audioElement === element) {
    audioElement = null
  }
}

export function getAudioElement() {
  return audioElement
}

export function getAudioCurrentTime() {
  return audioElement?.currentTime ?? 0
}

export function getAudioDuration() {
  return audioElement?.duration ?? 0
}

export function seekAudio(time: number) {
  if (!audioElement) return
  audioElement.currentTime = time
}

export function resetAudio() {
  if (!audioElement) return
  audioElement.currentTime = 0
}

export async function playAudio() {
  if (!audioElement) return
  await audioElement.play()
}

export function pauseAudio() {
  audioElement?.pause()
}
```

音量淡入淡出可以单独做：

```ts
function stopVolumeFade() {
  if (!fadeTimer) return
  clearInterval(fadeTimer)
  fadeTimer = null
}

export function fadeAudioVolume(targetVolume: number, duration = 500) {
  if (!audioElement) return Promise.resolve()

  stopVolumeFade()

  const startVolume = audioElement.volume
  const startedAt = performance.now()

  return new Promise<void>((resolve) => {
    fadeTimer = window.setInterval(() => {
      if (!audioElement) {
        stopVolumeFade()
        resolve()
        return
      }

      const progress = Math.min((performance.now() - startedAt) / duration, 1)
      audioElement.volume = startVolume + (targetVolume - startVolume) * progress

      if (progress >= 1) {
        stopVolumeFade()
        resolve()
      }
    }, 16)
  })
}
```

注意：`audioController` 不应该 import store，避免双向依赖。

## MusicPlayer.vue 改造方向

`MusicPlayer.vue` 只负责：

- 渲染 `<audio>`。
- 注册 audio 元素。
- 接收 audio 原生事件并通知 store。
- 渲染底部播放器 UI。

不再做：

- 不重写 `audio.play`。
- 不把组件实例挂到 `$audio`。
- 不承担全局播放器 API。

示例：

```ts
const audio = ref<HTMLAudioElement>()
const musicStore = useMusicStore()

onMounted(() => {
  if (audio.value) {
    registerAudioElement(audio.value)
  }
})

onBeforeUnmount(() => {
  if (audio.value) {
    unregisterAudioElement(audio.value)
  }
})

function handleTimeUpdate() {
  if (!audio.value) return
  musicStore.syncAudioTime(audio.value.currentTime)
}

function handleEnded() {
  musicStore.playNextByMode()
}

function handlePlay() {
  musicStore.syncPlaybackState(true)
}

function handlePause() {
  musicStore.syncPlaybackState(false)
}
```

模板：

```vue
<audio
  ref="audio"
  :src="musicStore.musicUrl"
  preload="auto"
  @timeupdate="handleTimeUpdate"
  @ended="handleEnded"
  @play="handlePlay"
  @pause="handlePause"
  @loadedmetadata="handleLoadedMetadata"
/>
```

## musicStore 改造方向

store 对外提供业务动作，不让组件直接碰 audio。

建议新增或重命名动作：

```ts
function syncAudioTime(time: number) {}
function syncPlaybackState(isPlaying: boolean) {}
function seekTo(time: number) {}
async function playPlayback() {}
async function pausePlayback(options?: { syncState?: boolean }) {}
async function togglePlayback() {}
async function playSong(song: GetMusicDetailData, index?: number) {}
function playNextByMode() {}
function playPreviousTrack() {}
function playNextTrack() {}
```

原有函数对应关系：

```text
getMusicUrlHandler -> playSong 或 loadAndPlaySong
cutSongHandler -> playNextTrack / playPreviousTrack
playEnd -> playNextByMode
getintelligenceList -> loadIntelligenceList
getLyric -> loadSongLyric
getDynamicCover -> loadDynamicCover
```

### 播放歌曲流程

推荐流程：

```ts
async function playSong(song: GetMusicDetailData, index = currentIndex.value) {
  const requestId = ++playRequestId

  currentIndex.value = index
  songs.value = song
  currentTime.value = 0

  resetAudio()
  await pausePlayback({ syncState: false })

  const [urlRes] = await Promise.all([
    getMusicUrlApi(song.id),
    loadSongLyric(song.id),
    loadDynamicCover(song.id)
  ])

  if (requestId !== playRequestId) return

  musicUrl.value = urlRes.data[0]?.url?.split('?')[0] || ''

  await nextTick()
  await playPlayback()
}
```

### seek 统一入口

```ts
function seekTo(time: number) {
  seekAudio(time)
  currentTime.value = time
}
```

所有组件都调用 `musicStore.seekTo(time)`。

### toggle 统一入口

```ts
async function togglePlayback() {
  if (isPlay.value) {
    await pausePlayback()
    return
  }

  await playPlayback()
}
```

所有组件都调用 `musicStore.togglePlayback()`。

## 歌词逻辑改造

当前 `getLyric` 只分别写入 `lrc` 和 `yrc`，但 `lrcMode` 没有跟随更新。建议统一为：

```ts
const lrcMode = ref<0 | 1>(0)
const lrc = ref<Lyric[] & { notSupportedScroll?: boolean }>([])
const yrc = ref<Yrc[] & { notSupportedScroll?: boolean }>([])
const activeLyric = computed(() => lrcMode.value === 1 ? yrc.value : lrc.value)
```

加载时：

```ts
let lyricRequestId = 0

async function loadSongLyric(id: number) {
  const requestId = ++lyricRequestId
  const { lrc: lrcRes, yrc: yrcRes } = await getLyricApi(id)

  if (requestId !== lyricRequestId) return

  lrc.value = []
  yrc.value = []

  if (yrcRes?.lyric) {
    yrc.value = parseLrc(yrcRes.lyric)
    lrcMode.value = 1
    return
  }

  if (lrcRes?.lyric) {
    lrc.value = parseYrc(lrcRes.lyric)
    lrcMode.value = 0
  }
}
```

这样歌词详情页可以只消费：

```ts
musicStore.activeLyric
musicStore.lrcMode
```

## 播放队列逻辑改造

当前 `orderTarget` 可以简化：

```ts
function getNextIndexByPlayMode() {
  const tracks = runtimeList.value?.tracks || []
  if (!tracks.length) return -1

  if (orderStatusVal.value === 2) {
    return randomNum(0, tracks.length - 1)
  }

  if (orderStatusVal.value === 3) {
    return currentIndex.value
  }

  return (currentIndex.value + 1) % tracks.length
}
```

上一首/下一首建议独立：

```ts
function playNextTrack() {}
function playPreviousTrack() {}
function playNextByMode() {}
```

这样组件层不需要知道播放模式细节。

## ProgressBar 改造

当前：

```ts
window.$audio.time = tempTime.value
musicStore.currentTime = tempTime.value
```

改为：

```ts
musicStore.seekTo(tempTime.value)
```

进度条组件只关心用户拖到了哪里，不关心底层 audio。

## MusicList 改造

当前：

```ts
window.$audio.togglePlay()
```

改为：

```ts
musicStore.togglePlayback()
```

播放新歌仍然调用：

```ts
musicStore.playSong(item, index)
```

如果保留父组件 `@play` 事件，也可以先过渡为：

```ts
emit('play', item, index)
```

但最终建议播放入口统一进 store。

## layout/index.vue 改造

当前 layout 负责：

```ts
window.$audio = audioInstance.value!
```

改造后：

- 删除 `audioInstance`。
- 不再设置 `window.$audio`。
- `MusicPlayer` 内部自己注册 audio 元素到 `audioController`。

过渡阶段可以先保留 `$audio`，但新增代码不再使用它。

## 迁移阶段

### 第一阶段：新增 audioController，保留 $audio

目标：不破坏现有功能，先建立新通道。

改动：

- 新增 `src/renderer/src/services/audioController.ts`。
- `MusicPlayer.vue` 挂载时注册 audio 元素。
- store 新增 `playPlayback`、`pausePlayback`、`seekTo`、`togglePlayback`。
- 暂时不删除 `$audio`。

验证：

- 播放/暂停正常。
- 拖动进度条正常。
- 切歌正常。
- 旧的 `$audio` 调用仍可用。

### 第二阶段：替换组件里的 $audio

目标：组件不再直接依赖 `$audio`。

改动：

- `ProgressBar.vue` 使用 `musicStore.seekTo`。
- `MusicList.vue` 使用 `musicStore.togglePlayback`。
- 其他 UI 组件如有 `$audio`，逐个替换为 store action。

验证：

- 双击当前歌曲可以暂停/继续。
- 右键菜单播放/暂停正常。
- 进度条 seek 正常。
- 抽屉播放列表播放正常。

### 第三阶段：替换 store 里的 $audio

目标：musicStore 不再依赖 `window.$audio`。

改动：

- `clearRuntimeList` 使用 `pausePlayback`。
- `playSong` 使用 `audioController.resetAudio`、`pauseAudio`、`playAudio`。
- `currentTime` 更新统一由 `MusicPlayer` audio 事件同步。

验证：

- 清空播放列表正常。
- 播放歌曲正常。
- 切歌时不会播放旧 URL。
- 快速切歌不会出现旧请求覆盖。

### 第四阶段：清理 MusicPlayer 暴露 API

目标：`MusicPlayer` 只做播放器 UI 和 audio 元素宿主。

改动：

- 删除 `defineExpose(exposeObj)` 或只暴露极少调试能力。
- 删除重写 `audio.play/pause`。
- 删除 layout 中 `window.$audio = audioInstance.value`。
- 删除 `types/global.d.ts` 中 `$audio` 声明。

验证：

- 全项目 `rg "\$audio"` 没有业务引用。
- 播放器功能正常。

### 第五阶段：性能审查与视觉增强

目标：在新架构稳定后做真正性能优化。

审查点：

- `currentTime` 更新频率是否合适。
- 大列表是否避免深层响应式频繁替换。
- 歌词同步是否交给歌词库，不靠 Vue 高频渲染。
- 背景动画是否只在详情页打开时运行。
- 切歌请求是否都有竞态保护。
- 音量 fade 是否不会堆积多个 timer。

## 验证清单

基础播放：

- 点击播放按钮可以播放。
- 点击暂停按钮可以暂停。
- 当前歌曲再次点击可以切换暂停/播放。
- 切下一首正常。
- 切上一首正常。
- 播放结束后按播放模式进入下一首。

播放队列：

- 普通列表播放后 runtimeList 正确。
- 抽屉列表播放不错误重置队列。
- 删除当前播放歌曲后自动切歌。
- 删除当前歌曲之前的歌曲后 currentIndex 修正。
- 下一首播放插入位置正确。

进度：

- 拖动进度条松手后 seek。
- seek 后 currentTime 立即更新。
- seek 后歌词位置能同步。

歌词：

- 有 yrc 时优先逐字歌词。
- 无 yrc 时降级 lrc。
- 无歌词时显示空状态。
- 快速切歌时旧歌词不覆盖新歌词。

异常：

- 音乐 URL 为空时不崩溃。
- 播放器未挂载时调用播放不会崩溃。
- `audio.play()` 被浏览器拒绝时有错误处理。

## 命名建议

建议逐步调整这些命名：

```text
getMusicUrlHandler -> playSong / loadAndPlaySong
cutSongHandler -> playNextTrack / playPreviousTrack
playEnd -> playNextByMode
getintelligenceList -> loadIntelligenceList
getLyric -> loadSongLyric
getDynamicCover -> loadDynamicCover
DetaulCenter -> DetailCenter
userAudio -> PlayerAudioElement 或直接使用 HTMLAudioElement
```

## 最终目标代码形态

组件调用：

```ts
musicStore.togglePlayback()
musicStore.seekTo(time)
musicStore.playSong(item, index)
musicStore.playNextTrack()
musicStore.playPreviousTrack()
```

store 内部调用：

```ts
playAudio()
pauseAudio()
seekAudio(time)
resetAudio()
```

播放器组件：

```ts
registerAudioElement(audio.value)
```

不再出现：

```ts
window.$audio.togglePlay()
window.$audio.time = time
window.$audio.pause(false)
audio.value!.play = play
audio.value!.pause = pause
```

## 推荐执行顺序

本项目建议先改造播放器架构，再进行全量性能审查。

原因：

- 当前最大问题是职责边界，不是单点性能。
- 架构稳定后，性能审查结果更准确。
- 直接全量审查容易发现很多点，但落地时仍会被 `$audio` 和 store 耦合卡住。

推荐顺序：

```text
1. 生成并确认本方案
2. 第一阶段：新增 audioController + store 新 action
3. 第二阶段：替换 ProgressBar / MusicList 等组件中的 $audio
4. 第三阶段：替换 musicStore 内部的 $audio
5. 第四阶段：删除全局 $audio
6. 第五阶段：做全量性能审查和歌词详情页接入
```

## 风险控制

- 每阶段只改一类调用点。
- 每阶段都保留可运行状态。
- 第一阶段不要删除 `$audio`，避免大面积断裂。
- 替换前用 `rg "\$audio"` 统计调用点。
- 替换后用轻量静态检查和手动播放流程验证。
- 不主动跑 build，除非当前任务明确要求构建验证。

