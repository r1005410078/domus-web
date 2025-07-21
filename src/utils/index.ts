export const isMobile =
  typeof window !== "undefined" && window.innerWidth <= 768;

// 首字母大写
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// 获取第一个表单错误信息
export function getFirstError(allErrors: any) {
  const errors = allErrors.form.errors;
  if (errors.length > 0) {
    for (const key in errors[0]) {
      for (const item of errors[0][key]) {
        return item?.message;
      }
    }
  }
}
