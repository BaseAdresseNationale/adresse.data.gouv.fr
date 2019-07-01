import {useMemo} from 'react'
import bbox from '@turf/bbox'

function useBounds(contour) {
  const data = useMemo(() => {
    if (contour) {
      return contour
    }

    return null
  }, [contour])

  return useMemo(() => data ? bbox(data) : data, [data])
}

export default useBounds
