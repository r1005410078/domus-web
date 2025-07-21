export const isMobile =
  typeof window !== "undefined" && window.innerWidth <= 768;

// 首字母大写
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
