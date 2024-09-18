export function formatFr(arr: string[]) {
  return arr.reduce((acc, curr, index) => {
    if (index === 0) {
      return curr
    }
    if (index === arr.length - 1) {
      return `${acc} et ${curr}`
    }
    return `${acc}, ${curr}`
  }, '')
}
