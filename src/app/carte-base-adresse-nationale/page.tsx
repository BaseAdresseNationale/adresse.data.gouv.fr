'use client'

import { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { AttributionControl, MapProvider, Map, NavigationControl, ScaleControl } from 'react-map-gl/maplibre'
import { useRouter, useSearchParams } from 'next/navigation'
import type { MapRef } from 'react-map-gl/maplibre'

import { getCommuneFlag } from '@/lib/api-wikidata'
import { getBanItem, getDistrict } from '@/lib/api-ban'

import Aside from './components/Aside'
import MapDataLoader from './components/MapDataLoader'
import { PanelAddressHeader, PanelAddress, PanelAddressFooter } from './components/PanelAddress'
import { PanelMicroToponymHeader, PanelMicroToponym, PanelMicroToponymFooter } from './components/PanelMicroToponym'
import { PanelDistrictHeader, PanelDistrict, PanelDistrictFooter } from './components/PanelDistrict'
import { MapSearchResultsWrapper } from './page.styles'

import BanMap from './components/ban-map'

import type { MapBreadcrumbPath } from './components/MapBreadcrumb'
import type {
  TypeAddressExtended,
  TypeMicroToponymPartial,
  TypeMicroToponymExtended,
  TypeDistrictExtended,
  TypeDistrict,
} from './types/LegacyBan.types'

import { useBanMapConfig } from './components/ban-map/BanMap.context'

import type { Address } from './components/ban-map/types'
import { env } from 'next-runtime-env'

interface LinkProps {
  href: string
  target?: string
}

const DEFAULT_CENTER = [1.7, 46.9]
const DEFAULT_ZOOM = 6
const DEFAULT_URL_DISTRICT_FLAG = '/commune/default-logo.svg'
const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

const getBanItemTypes = (banItem?: { type: 'commune' | 'voie' | 'lieu-dit' | 'numero' }) => {
  switch (banItem?.type) {
    case 'commune':
      return 'district'
    case 'voie':
    case 'lieu-dit':
      return 'micro-toponym'
    case 'numero':
      return 'address'
    default:
      return undefined
  }
}

const getDistrictBreadcrumbPath = (district: TypeDistrict | TypeDistrictExtended, districtLinkProps?: LinkProps) => ([
  district?.region?.nom ? `${district.region.nom}\u00A0(${district.region.code})` : 'Région non renseignée',
  district?.departement?.nom ? `${district.departement.nom}\u00A0(${district.departement.code})` : 'Département non renseigné',
  districtLinkProps
    ? {
        label: `${(district as TypeDistrict)?.nom || (district as TypeDistrictExtended)?.nomCommune}\u00A0(COG\u00A0${(district as TypeDistrict)?.code || (district as TypeDistrictExtended)?.codeCommune})`,
        linkProps: districtLinkProps,
      }
    : `${(district as TypeDistrict)?.nom || (district as TypeDistrictExtended)?.nomCommune}\u00A0(COG\u00A0${(district as TypeDistrict)?.code || (district as TypeDistrictExtended)?.codeCommune})`,
])
const getMicroTopoBreadcrumbPath = (
  microTopo: TypeMicroToponymPartial | TypeMicroToponymExtended,
  district?: TypeDistrict,
  microTopoLinkProps?: LinkProps,
) => ([
  ...getDistrictBreadcrumbPath(
    district || (microTopo as TypeMicroToponymExtended).commune,
    { href: `${URL_CARTOGRAPHY_BAN}?id=${(district || (microTopo as TypeMicroToponymExtended).commune)?.id}` },
  ),
  microTopoLinkProps
    ? {
        label: microTopo.nomVoie,
        linkProps: microTopoLinkProps,
      }
    : microTopo.nomVoie,
])

const getAddressBreadcrumbPath = (address: TypeAddressExtended) => ([
  ...getMicroTopoBreadcrumbPath(address.voie, address.commune, { href: `${URL_CARTOGRAPHY_BAN}?id=${address.voie.idVoie}` }),
  `Numéro ${address.numero ?? 'non renseigné'}${address.suffixe ? ` ${address.suffixe}` : ''}`,
])

function CartoView() {
  const searchParams = useSearchParams()
  const banMapRef = useRef<MapRef>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [mapSearchResults, setMapSearchResults] = useState<TypeDistrictExtended | TypeMicroToponymExtended | TypeAddressExtended | undefined>()
  const [districtLogo, setDistrictLogo] = useState<string | undefined>()
  const [mapBreadcrumbPath, setMapBreadcrumbPath] = useState<MapBreadcrumbPath>([])
  const [withCertificate, setWithCertificate] = useState<boolean>(false)
  const [isLoadMapSearchResults, setIsLoadMapSearchResults] = useState(false)
  const [isLoadMapTiles, setIsLoadMapTiles] = useState(false)
  const router = useRouter()
  const banMapConfigState = useBanMapConfig()
  const [banMapConfig] = banMapConfigState
  const { mapStyle, displayLandRegister } = banMapConfig

  const banItemId = searchParams?.get('id')
  const typeView = getBanItemTypes(mapSearchResults)

  const closeMapSearchResults = useCallback(() => {
    setIsMenuVisible(false)
    const timer = setTimeout(() => {
      setMapSearchResults(undefined)
      setDistrictLogo(undefined)
    }, 1000)
    return () => {
      setMapSearchResults(undefined)
      setDistrictLogo(undefined)
      clearTimeout(timer)
    }
  }, [])

  const selectBanItem = useCallback(({ id }: { id: string }) => router.push(`${URL_CARTOGRAPHY_BAN}?id=${id}`), [router])

  const unselectBanItem = useCallback(() => router.push(`${URL_CARTOGRAPHY_BAN}`), [router])

  useEffect(() => {
    isMapReady ? setIsLoadMapTiles(false) : setIsLoadMapTiles(true)
  }, [isMapReady])

  useEffect(() => {
    if (banItemId) {
      (async () => {
        setIsLoadMapSearchResults(true)

        const banItem = (await getBanItem(banItemId)) as unknown as TypeDistrictExtended | TypeMicroToponymExtended | TypeAddressExtended
        setMapSearchResults(banItem)

        const districtFlagUrl = await getCommuneFlag(banItemId)
        setDistrictLogo(districtFlagUrl || DEFAULT_URL_DISTRICT_FLAG)

        setIsLoadMapSearchResults(false)
      })()
    }
    else {
      return closeMapSearchResults()
    }
  }, [banItemId, closeMapSearchResults])

  useEffect(() => {
    if (isMapReady && mapSearchResults) {
      setMapBreadcrumbPath([]);

      (async () => {
        const { current: banMapGL } = banMapRef
        setIsMenuVisible(false)
        const banItem = mapSearchResults

        const typeItem = getBanItemTypes(banItem)
        if (typeItem === 'district') {
          setMapBreadcrumbPath(getDistrictBreadcrumbPath(banItem as TypeDistrictExtended))
        }
        else if (typeItem === 'micro-toponym') {
          setMapBreadcrumbPath(getMicroTopoBreadcrumbPath(banItem as TypeMicroToponymExtended))
        }
        else if (typeItem === 'address') {
          setMapBreadcrumbPath(getAddressBreadcrumbPath(banItem as TypeAddressExtended))
          let districtConfig: { certificate: boolean } = { certificate: false }
          const { banIdDistrict } = banItem as TypeAddressExtended

          if (banIdDistrict) {
            const districtRawResponse = await getDistrict(banIdDistrict)
            const district = districtRawResponse.response
            districtConfig = district.config || { certificate: false }
          }
          setWithCertificate(districtConfig.certificate)
        }
        const { displayBBox = [] } = banItem
        const bbox = displayBBox
        if (banMapGL && bbox && bbox.length === 4) {
          banMapGL.fitBounds(bbox, {
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
            duration: 2500,
          })
          setIsMenuVisible(true)
        }
      })()
    }
  }
  , [isMapReady, mapSearchResults])

  return (
    <MapProvider>
      <Map
        ref={banMapRef}
        id="banMapGL"
        initialViewState={{
          zoom: DEFAULT_ZOOM,
          latitude: (DEFAULT_CENTER[1]),
          longitude: (DEFAULT_CENTER[0]),
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: isMapReady ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
        mapStyle={mapStyle ? `/map-styles/${mapStyle}.json` : undefined}
        onLoad={() => setIsMapReady(true)}
        attributionControl={false}
      >
        <ScaleControl position="bottom-right" maxWidth={150} unit="metric" />
        <NavigationControl position="bottom-right" showCompass />
        <AttributionControl position="bottom-left" customAttribution="IGN" compact={true} />

        <BanMap
          address={mapSearchResults as unknown as Address}
          onSelect={selectBanItem}
          isCadastreLayersShown={displayLandRegister}
        />

        <Aside isInfo>
          <MapDataLoader isLoading={isLoadMapSearchResults}>
            Chargement des données de la BAN...
          </MapDataLoader>

          <MapDataLoader isLoading={isLoadMapTiles}>
            Chargement des données cartographiques...
          </MapDataLoader>
        </Aside>

        <Aside
          onClose={unselectBanItem}
          onClickToggler={mapSearchResults && (() => setIsMenuVisible(!isMenuVisible))}
          isOpen={isMenuVisible}
          path={mapBreadcrumbPath}
          header={
            ((typeView === 'district') && (<PanelDistrictHeader district={mapSearchResults as TypeDistrictExtended} logo={districtLogo} />))
            || ((typeView === 'micro-toponym') && (<PanelMicroToponymHeader microToponym={mapSearchResults as TypeMicroToponymExtended} />))
            || ((typeView === 'address') && (<PanelAddressHeader address={mapSearchResults as TypeAddressExtended} />))
          }
          footer={
            ((typeView === 'district') && (<PanelDistrictFooter banItem={mapSearchResults as TypeDistrictExtended} withCertificate={withCertificate} />))
            || ((typeView === 'micro-toponym') && (<PanelMicroToponymFooter banItem={mapSearchResults as TypeMicroToponymExtended} withCertificate={withCertificate} />))
            || ((typeView === 'address') && (<PanelAddressFooter banItem={mapSearchResults as TypeAddressExtended} withCertificate={withCertificate} />))
          }
        >
          {mapSearchResults
            ? (
                <MapSearchResultsWrapper>
                  {(typeView === 'district') && (<PanelDistrict district={mapSearchResults as TypeDistrictExtended} />)}
                  {(typeView === 'micro-toponym') && (<PanelMicroToponym microToponym={mapSearchResults as TypeMicroToponymExtended} />)}
                  {(typeView === 'address') && (<PanelAddress address={mapSearchResults as TypeAddressExtended} />)}
                </MapSearchResultsWrapper>
              )
            : null}
        </Aside>

      </Map>
    </MapProvider>
  )
}

export default function CartoPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <CartoView />
    </Suspense>
  )
}
