export function formatNumberToMillion(number: number) {
  if (number >= 100000000) {
    // 如果数字大于等于 1 亿
    const billionNumber = Math.floor(number / 10000000) / 10 // 强制截取一位小数
    return `${billionNumber}亿`
  } else if (number >= 10000) {
    // 如果数字大于等于 1 万
    const millionNumber = Math.floor(number / 1000) / 10 // 强制截取一位小数
    return `${millionNumber}万`
  } else {
    return number.toString() // 数字小于 1 万，不需要处理
  }
}

// 切换图片过渡 (防止图片闪烁
export function toggleImg(src: string, size?: string): Promise<HTMLImageElement> {
  if (!src) {
    return Promise.reject(`toggleImg：传递的src为空: ${src}`)
  }
  const img = new Image()
  img.src = size ? src + `?param=${size}` : src
  img.crossOrigin = 'Anonymous'
  img.width = document.body.clientWidth
  img.height = document.body.clientHeight

  return new Promise((resolve) => {
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      // 在实际应用中，您可能还想处理加载失败的情况
      console.error(`Failed to load image: ${src}`)
    }
  })
}

// 格式化日期
export function formatDate(timestamp: number, format = 'YYYY-MM-DD HH:mm:ss') {
  const date = new Date(timestamp);

  const pad = (n: number) => (n < 10 ? '0' + n : n);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, String(month))
    .replace(/DD/g, String(day))
    .replace(/HH/g, String(hour))
    .replace(/mm/g, String(minute))
    .replace(/ss/g, String(second));
}
