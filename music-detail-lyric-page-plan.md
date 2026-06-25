# 音乐歌词详情页技术方案

## 目标

点击底部播放器后，弹出一个全屏音乐详情页，用来展示当前歌曲的封面、歌曲信息、动态背景和同步歌词。

最终体验目标：

- 点击底部播放器打开歌词详情页。
- 详情页从底部平滑弹出，可关闭。
- 背景根据当前歌曲封面变化。
- 展示封面、歌名、歌手、歌词。
- 歌词支持滚动同步、当前行高亮、逐字高亮。
- 点击歌词可跳转播放进度。
- 播放、暂停、切歌、拖动进度时歌词状态正确同步。
- 后续可逐步增强封面动画、背景动画和视觉表现。

## 总体结论

推荐方案：

```text
歌词解析：@lrc-player/parse
歌词同步与逐字渲染：@lrc-player/core
详情页弹出、布局、封面、背景动画：项目自己实现
背景第一版：CSS 封面模糊 + 渐变
背景高级版：Three.js shader，可选
```

不建议第一版直接使用 AMLL，也不建议从零手写逐字歌词同步。当前项目的数据源是网易云 `/lyric/new`，`@lrc-player/parse` 和 `@lrc-player/core` 正好适配，开发成本和稳定性最好。

## 推荐目录结构

```text
src/renderer/src/store/modules/music.ts
  播放状态、当前歌曲、当前时间、歌词原文、解析后歌词、歌词详情页显示状态

src/renderer/src/views/layout/components/MusicDrawer.vue 或当前底部播放器组件
  点击后打开歌词详情页

src/renderer/src/components/MusicDetail/
  index.vue
    歌词详情页外壳、弹出动画、关闭逻辑

  MusicDetailHeader.vue
    返回/关闭按钮、可选操作按钮

  MusicCoverPanel.vue
    封面、动态封面、歌名、歌手

  MusicLyricPanel.vue
    歌词容器、无歌词状态、歌词库挂载点

  LyricAmbientBg.vue
    CSS 动态背景

  useLyricPlayer.ts
    @lrc-player/core 生命周期封装

  useCoverPalette.ts
    封面取色和颜色缓存，第二阶段再做
```

## 状态设计

播放器是唯一音频源，详情页只做展示和控制，不单独创建 audio。

建议在 music store 中维护这些状态：

```ts
const detailVisible = ref(false)
const currentTime = ref(0)
const isPlay = ref(false)
const songs = ref<GetMusicDetailData>()
const rawLrc = ref('')
const rawYrc = ref('')
const parsedLyric = ref([])
const lrcMode = ref<0 | 1>(0)
```

含义：

- `detailVisible`：歌词详情页是否打开。
- `currentTime`：当前播放时间，单位秒。
- `isPlay`：当前是否播放中。
- `songs`：当前播放歌曲。
- `rawLrc`：普通逐行歌词原文。
- `rawYrc`：网易云逐字歌词原文。
- `parsedLyric`：解析后传给 `@lrc-player/core` 的歌词数据。
- `lrcMode`：`0` 表示普通逐行，`1` 表示逐字歌词。

## 歌词获取与解析

当前项目可继续使用 `@lrc-player/parse`。

网易云歌词格式通常是：

```text
lrc.lyric
  [00:24.640]羽扇纶巾笑谈间

yrc.lyric
  [24850,2820](24850,430,0)羽(25280,340,0)扇...
```

解析规则：

```ts
import { parseLrc, parseYrc } from '@lrc-player/parse'

async function loadCurrentSongLyric(id: number) {
  const { lrc, yrc } = await getLyricApi(id)

  rawLrc.value = lrc?.lyric || ''
  rawYrc.value = yrc?.lyric || ''

  if (rawYrc.value) {
    parsedLyric.value = parseLrc(rawYrc.value)
    lrcMode.value = 1
    return
  }

  if (rawLrc.value) {
    parsedLyric.value = parseYrc(rawLrc.value)
    lrcMode.value = 0
    return
  }

  parsedLyric.value = []
}
```

注意：`@lrc-player/parse` 的命名比较反直觉：

- `parseLrc()` 解析网易云逐字歌词。
- `parseYrc()` 解析普通 `[00:00.000]文本` 逐行歌词。

## 防止旧请求覆盖新歌词

切歌很快时，旧歌词请求可能比新请求晚返回。需要加请求序号：

```ts
let lyricRequestId = 0

async function loadCurrentSongLyric(id: number) {
  const currentRequestId = ++lyricRequestId
  const { lrc, yrc } = await getLyricApi(id)

  if (currentRequestId !== lyricRequestId) return

  // 更新 rawLrc、rawYrc、parsedLyric、lrcMode
}
```

## 歌词渲染封装

不要在组件里使用 `document.querySelector('.lyric-container')` 直接查 DOM。更推荐使用组件 `ref`，并把 `@lrc-player/core` 封装成 composable。

示例：

```ts
// src/renderer/src/components/MusicDetail/useLyricPlayer.ts
import { onBeforeUnmount, shallowRef } from 'vue'
import Player from '@lrc-player/core'
import '@lrc-player/core/dist/style.css'

export function useLyricPlayer(audioRef, lyricContainerRef) {
  const player = shallowRef<Player>()

  function mountLyricPlayer() {
    if (!audioRef.value || !lyricContainerRef.value || player.value) return

    player.value = new Player({
      click(time: number, index: number) {
        audioRef.value.currentTime = time
        player.value?.syncIndex(index)
      }
    })

    player.value.mount(lyricContainerRef.value, audioRef.value)
  }

  function updateLyric(lyric, mode: 0 | 1) {
    if (!player.value || !lyric?.length) return
    player.value.updateAudioLrc(lyric, mode === 1 ? 'lrc' : 'yrc')
  }

  function playLyric() {
    player.value?.play()
  }

  function pauseLyric() {
    player.value?.pause()
  }

  function syncLyricIndex() {
    player.value?.syncIndex()
  }

  onBeforeUnmount(() => {
    player.value?.uninstall()
    player.value = undefined
  })

  return {
    mountLyricPlayer,
    updateLyric,
    playLyric,
    pauseLyric,
    syncLyricIndex
  }
}
```

好处：

- 组件边界清楚。
- 不依赖全局 class 查询。
- 详情页销毁时能释放歌词播放器实例。
- 后续如果换渲染库，只需要替换这个封装。

## MusicLyricPanel 设计

职责：

- 提供歌词挂载容器。
- 展示无歌词状态。
- 监听歌词变化并更新 `@lrc-player/core`。
- 监听播放状态并调用 `playLyric` / `pauseLyric`。

结构示例：

```vue
<template>
  <section class="music-lyric-panel">
    <div
      v-if="hasLyric"
      ref="lyricContainerRef"
      class="lyric-container"
    />
    <div v-else class="empty-lyric">
      暂无歌词
    </div>
  </section>
</template>
```

基础样式：

```scss
.music-lyric-panel {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.lyric-container {
  height: 100%;
  overflow-y: auto;
  mask-image: linear-gradient(
    to bottom,
    transparent,
    #000 12%,
    #000 88%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent,
    #000 12%,
    #000 88%,
    transparent
  );
}
```

## 详情页弹出层设计

`MusicDetail/index.vue` 负责弹出层，不负责具体歌词逻辑。

桌面布局：

```text
左侧 42%：封面、歌名、歌手
右侧 58%：歌词
```

窄屏布局：

```text
上方：封面、歌曲信息
下方：歌词
```

基础样式：

```scss
.music-detail {
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow: hidden;
  transform: translateY(100%);
  visibility: hidden;
  transition:
    transform 0.36s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.36s;
}

.music-detail.is-open {
  transform: translateY(0);
  visibility: visible;
}

.music-detail-content {
  position: relative;
  z-index: 2;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(280px, 42%) 1fr;
  gap: 48px;
  padding: 72px 80px 96px;
}
```

## 背景动画方案

背景分三个阶段做，不要一开始就上 Three.js。

### V1：封面模糊背景

第一版推荐这个，简单、稳定、性能好。

```vue
<template>
  <div class="ambient-bg">
    <img v-if="coverUrl" :src="coverUrl" class="ambient-cover" alt="" />
    <div class="ambient-mask" />
  </div>
</template>
```

```scss
.ambient-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #111;
}

.ambient-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(48px) saturate(1.4);
  transform: scale(1.18);
  opacity: 0.65;
}

.ambient-mask {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.16), transparent 28%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.72));
}
```

### V2：封面取色动态渐变

第二阶段再做，用 `colorthief` 从封面提取 3-5 个颜色，更新 CSS 变量。

```scss
.ambient-gradient {
  background:
    radial-gradient(circle at 20% 30%, var(--color-a), transparent 32%),
    radial-gradient(circle at 75% 25%, var(--color-b), transparent 34%),
    radial-gradient(circle at 50% 80%, var(--color-c), transparent 40%),
    #111;
  filter: blur(32px) saturate(1.35);
  animation: ambientFlow 18s ease-in-out infinite alternate;
}

@keyframes ambientFlow {
  from {
    transform: scale(1.08) rotate(0deg);
  }
  to {
    transform: scale(1.18) rotate(8deg);
  }
}
```

封面取色要做缓存：

```ts
const paletteCache = new Map<string, string[]>()
```

缓存 key 可以使用歌曲 id 或封面 URL。

### V3：Three.js Shader 背景

最后再做，适合 Apple Music 风格流体背景。

实现要求：

- 单独组件，例如 `MusicFluidBackground.vue`。
- 只在详情页打开时启动动画。
- 详情页关闭时暂停 `requestAnimationFrame`。
- 组件销毁时释放 `renderer`、`geometry`、`material`。
- 限制像素比：`Math.min(window.devicePixelRatio, 1.5)`。
- 低性能设备 fallback 到 CSS 背景。

不建议第一版就做 Three.js。它视觉上限高，但调参成本和性能风险都更高。

## 播放同步流程

底部播放器负责音频事件：

```text
audio timeupdate
  -> musicStore.currentTime = audio.currentTime

audio play
  -> musicStore.isPlay = true
  -> lyricPlayer.play()

audio pause
  -> musicStore.isPlay = false
  -> lyricPlayer.pause()

audio seeked
  -> lyricPlayer.syncIndex()

切歌成功
  -> 获取歌词
  -> 解析歌词
  -> lyricPlayer.updateAudioLrc()
```

详情页不要自己创建 audio，只通过 store 和现有播放器实例同步。

## 必做功能

第一版必须完成：

- 点击底部播放器打开详情页。
- 关闭按钮关闭详情页。
- Esc 关闭详情页。
- 展示当前歌曲封面、歌名、歌手。
- 展示歌词。
- 歌词随播放进度滚动。
- 当前行高亮。
- 逐字歌词优先，普通歌词降级。
- 点击歌词跳转播放进度。
- 切歌后刷新歌词。
- 播放/暂停同步歌词动画。
- 拖动进度后同步歌词当前位置。
- 无歌词状态。

## 后续增强功能

第二阶段：

- 封面切歌动画。
- 当前行放大，非当前行透明/轻微模糊。
- 背景根据封面取色。
- 播放时背景缓慢流动，暂停时减速或暂停。
- 如果有动态封面 `videoPlayUrl`，优先展示动态封面。

第三阶段：

- Three.js 流体背景。
- 低性能设备自动降级。
- 支持 `prefers-reduced-motion`。
- 歌词渲染延迟挂载。
- 详情页关闭时暂停背景动画。
- 背景动画按播放状态调速。

## 性能原则

1. 歌词不要每帧用 Vue 重渲染。

   逐字高亮和滚动交给 `@lrc-player/core`，避免 Vue 响应式频繁更新大量 DOM。

2. `currentTime` 不要驱动大面积模板更新。

   需要显示时间的地方再依赖 `currentTime`，歌词同步交给播放器实例。

3. 背景动画不要常驻。

   详情页关闭时暂停 CSS/Three.js 动画。Three.js 必须停止 `requestAnimationFrame`。

4. 封面取色必须缓存。

   避免同一首歌反复打开详情页时重复取色。

5. 切歌请求要防竞态。

   用请求 id 避免旧歌词覆盖新歌词。

6. Three.js 必须释放资源。

   否则反复打开详情页会逐渐占用更多内存。

## 推荐实施顺序

1. 在 store 中增加 `detailVisible`。
2. 底部播放器点击时打开详情页。
3. 新建 `MusicDetail/index.vue`，完成弹出层和关闭逻辑。
4. 新建 `MusicCoverPanel.vue`，展示封面、歌名、歌手。
5. 新建 `MusicLyricPanel.vue`，提供歌词容器和无歌词状态。
6. 封装 `useLyricPlayer.ts`。
7. 接入 `@lrc-player/core`，让歌词能显示和同步滚动。
8. 接入点击歌词跳转。
9. 接入切歌刷新歌词。
10. 接入封面模糊背景。
11. 覆盖歌词样式，做当前行视觉。
12. 做封面取色动态渐变。
13. 最后评估是否需要 Three.js 背景。

## 对比 F:\code\Music 的改进点

`F:\code\Music` 的实现有参考价值，但不建议原样照搬。

可以借鉴：

- 使用 `@lrc-player/core` 做歌词同步。
- 使用 `@lrc-player/parse` 解析网易云歌词。
- 详情页从底部弹出。
- 封面和歌词左右布局。
- 封面取色做背景。

建议改进：

- 不使用 `document.querySelector('.lyric-container')`，改用 Vue `ref`。
- 不使用全局 DOM id 控制背景，改成组件内部 ref。
- `Player` 实例要在组件销毁时 `uninstall()`。
- Three.js 背景不要第一版就引入。
- 背景动画和歌词渲染分离，避免组件职责过重。

## 最终建议

当前项目最优路线：

```text
第一版：
  @lrc-player/core + 封面模糊背景 + 基础弹出页

第二版：
  封面取色 + CSS 动态渐变 + 歌词样式增强

第三版：
  可选 Three.js shader 背景 + 性能降级策略
```

这样能在最短时间内做出可用、稳定、好维护的歌词详情页，同时保留后续升级到高级视觉效果的空间。
