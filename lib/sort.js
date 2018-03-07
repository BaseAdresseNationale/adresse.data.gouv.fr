const isSort = (array, func) => {
  return array.every((val, i, arr) => !i || (func(val) >= func(arr[i - 1])))
}

export default isSort
