import {useEffect, createContext, useState, useMemo} from 'react'
import PropTypes from 'prop-types'

const MOBILE_WIDTH = 900

const DeviceContext = createContext()

export function DeviceContextProvider({isSafariBrowser, ...props}) {
  const [viewHeight, setViewHeight] = useState('100vh')
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  const handleResize = () => {
    setViewHeight(`${window.innerHeight}px`)
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const value = useMemo(() => {
    return {
      viewHeight,
      isMobileDevice,
      isSafariBrowser
    }
  }, [viewHeight, isMobileDevice, isSafariBrowser])

  return (
    <DeviceContext.Provider
      value={value}
      {...props}
    />
  )
}

DeviceContextProvider.propTypes = {
  isSafariBrowser: PropTypes.bool.isRequired
}

export default DeviceContext
