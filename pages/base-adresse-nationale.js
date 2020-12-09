import React, {useState, useCallback, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {getCommune, getVoie, getNumero} from '@/lib/explore/api'

import Page from '@/layouts/main'
import {Desktop, Mobile} from '@/layouts/base-adresse-nationale'

const MOBILE_WIDTH = 800

function BaseAdresseNationale({commune, voie, numero}) {
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const Layout = isMobileDevice ? Mobile : Desktop

  const router = useRouter()

  const bbox = useMemo(() => {
    const context = numero || voie || commune || {}
    return context.displayBBox
  }, [commune, voie, numero])

  const handleResize = () => {
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  const selectAddress = useCallback(address => {
    const {id, voie} = address
    const idVoie = address.id || voie.idVoie
    const [codeCommune] = idVoie.split('_')
    let href = `${router.pathname}?codeCommune=${codeCommune}&idVoie=${idVoie}`
    let as = `${router.pathname}/commune/${codeCommune}/voie/${idVoie}`

    if (voie) {
      href += `&idNumero=${id}`
      as += `/numero/${id}`
    }

    router.push(href, as)
  }, [router])

  useEffect(() => {
    if (window.innerWidth < MOBILE_WIDTH) {
      setIsMobileDevice(true)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Page title='Base Adresse Nationale' description='Consultez les adresses de la Base Adresse Nationale' hasFooter={false}>
      <Layout
        commune={commune}
        voie={voie}
        numero={numero}
        bbox={bbox}
        handleSelect={selectAddress}
      />
    </Page>
  )
}

BaseAdresseNationale.propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.object,
  numero: PropTypes.object
}

export async function getServerSideProps({query}) {
  const {codeCommune, idVoie, idNumero} = query

  if (!codeCommune) {
    return {props: {}}
  }

  try {
    const promises = [getCommune(codeCommune)]

    if (idVoie) {
      promises.push(getVoie(idVoie))

      if (idNumero) {
        promises.push(getNumero(idNumero))
      }
    }

    const [commune, voie, numero] = await Promise.all(promises)

    return {
      props: {
        commune,
        voie: voie || null,
        numero: numero || null
      }
    }
  } catch {
    return {
      notFound: true
    }
  }
}

export default BaseAdresseNationale
