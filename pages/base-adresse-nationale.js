import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {getAddress} from '@/lib/api-ban'

import Page from '@/layouts/main'
import {Desktop, Mobile} from '@/layouts/base-adresse-nationale'

const MOBILE_WIDTH = 800

function BaseAdresseNationale({address}) {
  const [viewHeight, setViewHeight] = useState('100vh')
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const Layout = isMobileDevice ? Mobile : Desktop

  const router = useRouter()

  const handleResize = () => {
    setViewHeight(`${window.innerWidth}px`)
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  const selectAddress = useCallback(({id}) => {
    router.push(`/base-adresse-nationale?id=${id}`, `/base-adresse-nationale/${id}`)
  }, [router])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Page title='Base Adresse Nationale' description='Consultez les adresses de la Base Adresse Nationale' hasFooter={false}>
      <Layout
        address={address}
        bbox={address ? address.displayBBox : null}
        viewHeight={viewHeight}
        handleSelect={selectAddress}
      />
    </Page>
  )
}

BaseAdresseNationale.defaultProps = {
  address: null
}

BaseAdresseNationale.propTypes = {
  address: PropTypes.shape({
    displayBBox: PropTypes.array.isRequired
  })
}

export async function getServerSideProps({query}) {
  const {id} = query

  if (!id) {
    return {props: {}}
  }

  try {
    const address = await getAddress(id)

    if (!address) {
      return {
        notFound: true
      }
    }

    return {
      props: {address}
    }
  } catch {
    return {
      notFound: true
    }
  }
}

export default BaseAdresseNationale
