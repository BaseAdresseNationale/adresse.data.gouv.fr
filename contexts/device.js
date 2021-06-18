import React, {useEffect, createContext, useState} from 'react'
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

  return (
    <DeviceContext.Provider
      value={{
        viewHeight,
        isMobileDevice,
        isSafariBrowser
      }}
      {...props}
    />
  )
}

DeviceContextProvider.propTypes = {
  isSafariBrowser: PropTypes.bool.isRequired
}

export default DeviceContext
