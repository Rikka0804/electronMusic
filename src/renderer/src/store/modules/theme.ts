import { defineStore } from "pinia";
import { ref } from "vue";
import ColorThief from "colorthief";
import { toggleImg } from "@/utils/utils";

export const useThemeStore = defineStore("themeId", () => {
  const bgColor = ref<string | number[]>("");
  const pointer = ref(1); // 用于判断使用哪个背景层

  const change = async (src?: string) => {
    const app = document.querySelector("#opacity-bg1") as HTMLDivElement;
    const opacityBg = document.querySelector("#opacity-bg") as HTMLDivElement;

    // 没传 src：恢复默认背景
    if (!src) {
      bgColor.value = "";

      if (pointer.value === 0) {
        app.style.backgroundImage = ``;
        app.style.opacity = "1";
        opacityBg.style.opacity = "0";
        pointer.value = 1;
      } else {
        opacityBg.style.backgroundImage = ``;
        opacityBg.style.opacity = "1";
        app.style.opacity = "0";
        pointer.value = 0;
      }
      return;
    }

    // 有图片：计算主题色
    const img = await toggleImg(src);
    const colorThief = new ColorThief();
    let rgb = colorThief.getColor(img);

    // 颜色调整（压暗）
    rgb = [rgb[0] / 2, rgb[1] * 0.6, rgb[2] * 0.7];

    // 如果主题色相同，忽略
    if (Array.isArray(bgColor.value)) {
      const isRepeat = rgb.every((val, idx) => val === bgColor.value[idx]);
      if (isRepeat) return;
    }

    bgColor.value = rgb;

    // 通过 pointer 控制两层背景渐变效果
    if (pointer.value === 0) {
      app.style.backgroundImage = `linear-gradient(rgb(${rgb}), rgb(19, 19, 26) 50%)`;
      app.style.opacity = "1";
      opacityBg.style.opacity = "0";
      pointer.value = 1;
    } else {
      opacityBg.style.backgroundImage = `linear-gradient(rgb(${rgb}), rgb(19, 19, 26) 50%)`;
      opacityBg.style.opacity = "1";
      app.style.opacity = "0";
      pointer.value = 0;
    }
  };

  return {
    bgColor,
    pointer,
    change,
  };
});
