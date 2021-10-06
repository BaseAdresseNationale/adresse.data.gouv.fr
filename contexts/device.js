import {useEffect, createContext, useState, useMemo} from 'react'

const MOBILE_WIDTH = 900

const DeviceContext = createContext()

export function DeviceContextProvider(props) {
  const [viewHeight, setViewHeight] = useState('100vh')
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isSafariBrowser, setIsSafariBrowser] = useState(false)

  const handleResize = () => {
    setViewHeight(`${window.innerHeight}px`)
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  useEffect(() => {
    setIsSafariBrowser(navigator.vendor.toLowerCase().includes('apple'))
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

export default DeviceContext
