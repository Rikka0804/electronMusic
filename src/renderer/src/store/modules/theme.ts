import { defineStore } from "pinia";
import { ref } from "vue";
import ColorThief from "colorthief";
import { toggleImg } from "@/utils/utils";

const DEFAULT_BG = "rgb(19, 19, 26)";

export const useThemeStore = defineStore("themeId", () => {
  const bgColor = ref<string | number[]>("");
  const pointer = ref(1);

  let primaryBg: HTMLDivElement | null = null;
  let secondaryBg: HTMLDivElement | null = null;
  let requestId = 0;
  let resetTimer: ReturnType<typeof setTimeout> | null = null;
  let currentGradient = "";

  const getLayers = () => {
    if (!primaryBg) primaryBg = document.querySelector("#opacity-bg1");
    if (!secondaryBg) secondaryBg = document.querySelector("#opacity-bg");
    if (!primaryBg || !secondaryBg) return null;

    primaryBg.style.willChange = "opacity, background-image";
    secondaryBg.style.willChange = "opacity, background-image";
    return { primaryBg, secondaryBg };
  };

  const normalizeColor = (rgb: number[]) => {
    const toInt = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
    return [toInt(rgb[0] * 0.5), toInt(rgb[1] * 0.6), toInt(rgb[2] * 0.7)];
  };

  const applyGradient = (gradient: string) => {
    const layers = getLayers();
    if (!layers) return;
    if (gradient === currentGradient) return;

    const { primaryBg: app, secondaryBg: opacityBg } = layers;
    if (pointer.value === 0) {
      app.style.backgroundImage = gradient;
      app.style.opacity = "1";
      opacityBg.style.opacity = "0";
      pointer.value = 1;
    } else {
      opacityBg.style.backgroundImage = gradient;
      opacityBg.style.opacity = "1";
      app.style.opacity = "0";
      pointer.value = 0;
    }
    currentGradient = gradient;
  };

  const resetToDefault = () => {
    bgColor.value = "";
    applyGradient(`linear-gradient(${DEFAULT_BG}, ${DEFAULT_BG} 50%)`);
  };

  const change = async (src?: string) => {
    requestId += 1;
    const currentId = requestId;

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    if (!src) {
      // Route guard often resets before next page sets its own theme.
      // Delay briefly to avoid visible flash, and allow cancellation.
      resetTimer = setTimeout(() => {
        if (currentId !== requestId) return;
        resetToDefault();
      }, 140);
      return;
    }

    const layers = getLayers();
    if (!layers) return;

    try {
      const img = await toggleImg(src);
      if (currentId !== requestId) return;

      const colorThief = new ColorThief();
      const normalized = normalizeColor(colorThief.getColor(img));

      if (Array.isArray(bgColor.value)) {
        const isSame = normalized.every((val, idx) => val === bgColor.value[idx]);
        if (isSame) return;
      }

      bgColor.value = normalized;
      applyGradient(`linear-gradient(rgb(${normalized.join(", ")}), ${DEFAULT_BG} 50%)`);
    } catch (error) {
      if (currentId !== requestId) return;
      console.warn("[theme] failed to calculate theme color:", error);
      resetToDefault();
    }
  };

  return {
    bgColor,
    pointer,
    change,
  };
});
