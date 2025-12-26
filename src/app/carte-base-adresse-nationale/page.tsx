'use client'

import { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { env } from 'next-runtime-env'
import { useRouter, useSearchParams } from 'next/navigation'
import { AttributionControl, MapProvider, Map, NavigationControl, ScaleControl } from 'react-map-gl/maplibre'
import { LngLatBounds } from 'maplibre-gl'

import { getCommuneFlagProxy } from '@/lib/api-blasons-communes'
import { getBanItem } from '@/lib/api-ban'

import { useBanMapConfig } from './components/ban-map/BanMap.context'
import Aside from './components/Aside'
import BanMap from './components/ban-map'
import LoadingBar from './components/LoadingBar'
import MapBreadcrumb from './components/MapBreadcrumb'
import { isMobileView, getMapPadding } from './components/Panel'
import { PanelAddressHeader, PanelAddress, PanelAddressFooter } from './components/PanelAddress'
import { PanelMicroToponymHeader, PanelMicroToponym, PanelMicroToponymFooter } from './components/PanelMicroToponym'
import { PanelDistrictHeader, PanelDistrict, PanelDistrictFooter } from './components/PanelDistrict'
import { MapWrapper, MapSearchResultsWrapper } from './page.styles'

import type { MapRef } from 'react-map-gl/maplibre'
import type { MapBreadcrumbPath } from './components/MapBreadcrumb'
import type { Address } from './components/ban-map/types'
import type {
  TypeAddressExtended,
  TypeMicroToponymPartial,
  TypeMicroToponymExtended,
  TypeDistrictExtended,
  TypeDistrict,
} from './types/LegacyBan.types'

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

interface BanMapGL {
  getCenter: () => { lng: number, lat: number }
  getZoom: () => number
}

const getMapHash = (banMapGL: BanMapGL | null): string | undefined => {
  if (banMapGL) {
    const { lng, lat } = banMapGL.getCenter()
    const zoom = banMapGL.getZoom()
    const hash = `${lat.toFixed(6)}_${lng.toFixed(6)}_${zoom.toFixed(2)}`
    return hash
  }
  return
}

interface Bounds {
  getNorth: () => number
  getSouth: () => number
  getEast: () => number
  getWest: () => number
}

const isBboxIntersect = (bounds1: Bounds, bounds2: Bounds): boolean => {
  return (
    bounds1.getNorth() >= bounds2.getSouth()
    && bounds1.getSouth() <= bounds2.getNorth()
    && bounds1.getEast() >= bounds2.getWest()
    && bounds1.getWest() <= bounds2.getEast()
  )
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

interface Position {
  position: {
    coordinates: [number, number] | [number, number, number]
  }
}

const getBboxFromPositions = (positions: Position[]): [number, number, number, number] => {
  return positions.reduce<[number, number, number, number]>(
    (acc, entry: Position) => {
      const [lng, lat] = entry.position.coordinates
      acc[0] = Math.min(acc[0], lng)
      acc[1] = Math.min(acc[1], lat)
      acc[2] = Math.max(acc[2], lng)
      acc[3] = Math.max(acc[3], lat)
      return acc
    },
    [
      positions[0].position.coordinates[0],
      positions[0].position.coordinates[1],
      positions[0].position.coordinates[0],
      positions[0].position.coordinates[1],
    ],
  )
}

function CartoView() {
  const [isMapReady, setIsMapReady] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [mapSearchResults, setMapSearchResults] = useState<TypeDistrictExtended | TypeMicroToponymExtended | TypeAddressExtended | undefined>()
  const [districtLogo, setDistrictLogo] = useState<string | undefined>()
  const [mapBreadcrumbPath, setMapBreadcrumbPath] = useState<MapBreadcrumbPath>([])
  const [withCertificate, setWithCertificate] = useState<boolean>(false)
  const [isLoadMapSearchResults, setIsLoadMapSearchResults] = useState(false)
  const [isLoadMapTiles, setIsLoadMapTiles] = useState(false)

  const banMapRef = useRef<MapRef>(null)
  const asideRef = useRef<HTMLDivElement>(null)
  const oldMapSearchResults = useRef<TypeDistrictExtended | TypeMicroToponymExtended | TypeAddressExtended | null>(null)

  type Lon = number
  type Lat = number
  type Zoom = number
  type PositionArray = [Lon, Lat, Zoom]
  type MinLon = Lon
  type MinLat = Lat
  type MaxLon = Lon
  type MaxLat = Lat
  type BoundsArray = [MinLon, MinLat, MaxLon, MaxLat]
  interface HashMap {
    value: string
    position?: PositionArray
    bounds?: BoundsArray
  }

  const searchParams = useSearchParams()
  const initHash = useRef<string | null>(null)
  const [hash, setHash] = useState<HashMap | null>(null)
  const router = useRouter()
  const banMapConfigState = useBanMapConfig()

  const [{ mapStyle, displayLandRegister }] = banMapConfigState
  const banItemId = searchParams?.get('id')
  const typeView = getBanItemTypes(mapSearchResults)

  const selectBanItem = useCallback(({ id }: { id: string }) => router.push(`${URL_CARTOGRAPHY_BAN}?id=${id}`), [router])
  const unselectBanItem = useCallback(() => router.push(`${URL_CARTOGRAPHY_BAN}`), [router])
  const onTargetClick = useCallback(() => asideRef.current?.scrollTo(0, 0), [])
  const closeMapSearchResults = useCallback(() => {
    setIsMenuVisible(false)
    const timer = setTimeout(() => {
      setMapSearchResults(undefined)
      setMapBreadcrumbPath([])
      setDistrictLogo(undefined)
    }, 1000)
    return () => {
      setMapSearchResults(undefined)
      setMapBreadcrumbPath([])
      setDistrictLogo(undefined)
      clearTimeout(timer)
    }
  }, [])
  const updateHashPosition = useCallback((hash: string) => {
    if (window && window.location) {
      if (window.location?.hash === hash) return
      const locationPrefix = `${window.location.pathname}${window.location.search}`
      const newLocation = hash ? `${locationPrefix}#${hash}` : locationPrefix
      router.replace(newLocation)
    }
  }, [router])
  const onMoveHandle = useCallback(() => {
    const { current: banMapGL } = banMapRef
    const hash = getMapHash(banMapGL)
    updateHashPosition(hash || '')
  }, [updateHashPosition])

  // InitialPosition from hash
  useEffect(() => {
    if (window?.location?.hash) {
      initHash.current = window?.location?.hash?.slice(1)
      const hash = initHash.current
      const [lon, lat, zoom] = hash.split('_').map(Number)
      const hashPosition = [lon, lat, zoom]
      setHash({
        value: hash,
        position: hashPosition as PositionArray,
      })
    }
  }, [])

  // Config map animation
  useEffect(() => {
    const { current: banMapGL } = banMapRef
    if (isMapReady && banMapGL) {
      const isMobile = isMobileView()
      const padding = getMapPadding({
        isMobileView: isMobile,
        isMenuVisible,
      })
      banMapGL.setPadding(padding || { top: 30, bottom: 30, left: 30, right: 30 })
    }
  }, [isMapReady, isMenuVisible])

  // Load map tiles
  useEffect(() => {
    const loadMapTiles = () => {
      isMapReady
        ? setIsLoadMapTiles(false)
        : setIsLoadMapTiles(true)  
    }
    loadMapTiles()
  }, [isMapReady])

  // Load search datas
  useEffect(() => {
    if (banItemId) {
      (async () => {
        setIsLoadMapSearchResults(true)

        // Load search item & district flag
        const banItemPromise = (getBanItem(banItemId))
        const districtFlagUrlPromise = getCommuneFlagProxy(banItemId)
        const [banItem, districtFlagUrl] = await Promise.all([
          banItemPromise as unknown as Promise<TypeDistrictExtended | TypeMicroToponymExtended | TypeAddressExtended>,
          districtFlagUrlPromise as Promise<string | undefined>,
        ])
        setMapSearchResults(banItem)
        setDistrictLogo(districtFlagUrl || DEFAULT_URL_DISTRICT_FLAG)

        // Update breadcrumb path & Actions Params
        switch (getBanItemTypes(banItem)) {
          case 'district':
            setMapBreadcrumbPath(getDistrictBreadcrumbPath(banItem as TypeDistrictExtended))
            break
          case 'micro-toponym':
            setMapBreadcrumbPath(getMicroTopoBreadcrumbPath(banItem as TypeMicroToponymExtended))
            break
          case 'address':
            setMapBreadcrumbPath(getAddressBreadcrumbPath(banItem as TypeAddressExtended))
            const config = (banItem as TypeAddressExtended).config
            setWithCertificate(config?.certificate ? true : false)
            break
          default:
            setMapBreadcrumbPath([])
            setWithCertificate(false)
            break
        }

        setIsLoadMapSearchResults(false)
      })()
    }
    else {
      return () => { closeMapSearchResults() }
    }
  }, [banItemId, closeMapSearchResults])

  // Position map to Search results
  useEffect(() => {
    if (
      isMapReady
      && mapSearchResults
      && oldMapSearchResults.current !== mapSearchResults
    ) {
      const { current: banMapGL } = banMapRef

      const banItem = mapSearchResults

      // Display Search results
      const bbox: [number, number, number, number] = ('positions' in banItem && banItem.positions.length > 1)
        ? getBboxFromPositions(banItem.positions)
        : banItem.displayBBox

      if (banMapGL && bbox && bbox.length === 4) {
        if (!initHash.current) {
          function handleHash() {
            setHash({
              value: bbox.join('_'),
              bounds: bbox,
            })
            setIsMenuVisible(true)
          }
          handleHash()
        }
        oldMapSearchResults.current = banItem
      }
    }
  }
  , [isMapReady, mapSearchResults])

  // Map focus & animation
  useEffect(() => {
    const { current: banMapGL } = banMapRef

    if (isMapReady && banMapGL && hash) {
      const mapZoom = banMapGL.getZoom()
      const mapBounds = banMapGL.getBounds()
      const bbox = hash?.bounds
      const position = hash?.position

      if (position && position.length === 3) {
        const hashBounds = new LngLatBounds([position[0], position[1]], [position[0], position[1]])
        const isBBoxVisible: boolean = (Math.ceil(mapZoom) >= 9) && isBboxIntersect(mapBounds, hashBounds)

        banMapGL.flyTo({
          center: [position[1], position[0]],
          zoom: position[2],
          animate: isBBoxVisible,
        })
      }

      else if (bbox && bbox.length === 4) {
        const hashBounds = new LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]])
        const isBBoxVisible = (Math.ceil(mapZoom) >= 9) && isBboxIntersect(mapBounds, hashBounds)

        banMapGL.fitBounds(bbox, {
          animate: isBBoxVisible,
          duration: 1250,
        })
      }

      initHash.current = null
    }
  }, [isMapReady, hash])

  return (
    <MapWrapper className={`${isMapReady ? '' : 'loading'}`}>
      <MapProvider>
        <LoadingBar $isLoading={isLoadMapSearchResults || isLoadMapTiles} />
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
          onMoveEnd={onMoveHandle}
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

          <Aside
            ref={asideRef}
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
              ((typeView === 'district') && (<PanelDistrictFooter banItem={mapSearchResults as TypeDistrictExtended} withCertificate={withCertificate} onClickAction={onTargetClick} />))
              || ((typeView === 'micro-toponym') && (<PanelMicroToponymFooter banItem={mapSearchResults as TypeMicroToponymExtended} withCertificate={withCertificate} onClickAction={onTargetClick} />))
              || ((typeView === 'address') && (<PanelAddressFooter banItem={mapSearchResults as TypeAddressExtended} withCertificate={withCertificate} onClickAction={onTargetClick} />))
            }
          >
            {mapSearchResults
              ? (
                  <>
                    {mapBreadcrumbPath?.length > 0 && <MapBreadcrumb path={mapBreadcrumbPath} />}
                    <MapSearchResultsWrapper>
                      {(typeView === 'district') && (<PanelDistrict district={mapSearchResults as TypeDistrictExtended} />)}
                      {(typeView === 'micro-toponym') && (<PanelMicroToponym microToponym={mapSearchResults as TypeMicroToponymExtended} onFlyToPosition={onTargetClick} />)}
                      {(typeView === 'address') && (<PanelAddress address={mapSearchResults as TypeAddressExtended} onFlyToPosition={onTargetClick} />)}
                    </MapSearchResultsWrapper>
                  </>
                )
              : null}
          </Aside>

        </Map>
      </MapProvider>
    </MapWrapper>
  )
}

export default function CartoPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <CartoView />
    </Suspense>
  )
}
