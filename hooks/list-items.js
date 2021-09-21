import {useState, useEffect} from 'react'

export function useListItem(items, renderList) {
  const [list, setList] = useState([])

  useEffect(() => {
    if (items) {
      let list = items
      if (renderList) {
        list = renderList(items)
      }

      setList(list)
    }
  }, [items, renderList])

  return list
}
