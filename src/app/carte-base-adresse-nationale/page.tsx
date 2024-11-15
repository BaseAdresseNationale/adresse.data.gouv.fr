'use client'

import { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { AttributionControl, MapProvider, Map, NavigationControl, ScaleControl } from 'react-map-gl/maplibre'
import { useSearchParams } from 'next/navigation'
import type { MapRef } from 'react-map-gl/maplibre'

import { getCommuneFlag } from '@/lib/api-wikidata'
import { getBanItem, getDistrict } from '@/lib/api-ban'

import Aside from './components/Aside'
import MapBreadcrumb from './components/MapBreadcrumb'
import MapDataLoader from './components/MapDataLoader'
import MicroToponymAddressList from './components/micro-toponym/MicroToponymAddressList'
import MicroToponymCard from './components/micro-toponym/MicroToponymCard'
import { AddressCard } from './components/address'
import { DistrictCard, DistrictMicroToponymList } from './components/district'
import { MapSearchResultsWrapper } from './page.styles'
import BanMap from './components/ban-map'

import type {
  TypeAddressExtended,
  TypeMicroToponymPartial,
  TypeMicroToponymExtended,
  TypeDistrictExtended,
  TypeDistrict,
} from './types/LegacyBan.types'
import { useRouter } from 'next/navigation'

import { useBanMapConfig } from './components/ban-map/BanMap.context'

import type { Address } from './components/ban-map/types'

interface LinkProps {
  href: string
  target?: string
}
type MapBreadcrumbPathSegment = string | { label: string, linkProps?: LinkProps }

const DEFAULT_CENTER = [1.7, 46.9]
const DEFAULT_ZOOM = 6
const DEFAULT_URL_DISTRICT_FLAG = '/commune/default-logo.svg'
const URL_CARTOGRAPHY_BAN = process.env.NEXT_PUBLIC_URL_CARTOGRAPHY_BAN

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
  const [mapBreadcrumbPath, setMapBreadcrumbPath] = useState<MapBreadcrumbPathSegment[]>([])
  const [withCertificate, setWithCertificate] = useState<boolean>(false)
  const [isLoadMapSearchResults, setIsLoadMapSearchResults] = useState(false)
  const [isLoadMapTiles, setIsLoadMapTiles] = useState(false)

  const banMapConfigState = useBanMapConfig()
  const [banMapConfig, dispatchToBanMapConfig] = banMapConfigState
  const { mapStyle, displayLandRegister } = banMapConfig

  const banItemId = searchParams?.get('id')
  const typeView = getBanItemTypes(mapSearchResults)

  useEffect(() => {
    console.log('isMapReady', isMapReady)
    isMapReady ? setIsLoadMapTiles(false) : setIsLoadMapTiles(true)
  }, [isMapReady])

  useEffect(() => {
    if (banItemId) {
      (async () => {
        setIsLoadMapSearchResults(true)

        const banItem = (await getBanItem(banItemId)) as unknown as TypeDistrictExtended | TypeMicroToponymExtended | TypeAddressExtended
        setMapSearchResults(banItem)

        const districtFlagUrl = await getCommuneFlag(banItemId)
        console.log('districtFlagUrl', districtFlagUrl)
        setDistrictLogo(districtFlagUrl || DEFAULT_URL_DISTRICT_FLAG)

        setIsLoadMapSearchResults(false)
      })()
    }
  }, [banItemId])

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

  const router = useRouter()

  const selectAddress = useCallback(({ id }: { id: string }) => {
    router.push(`${URL_CARTOGRAPHY_BAN}?id=${id}`)
  }, [router])

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
          onSelect={selectAddress}
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
          onClickToggler={mapSearchResults && (() => setIsMenuVisible(!isMenuVisible))}
          isOpen={isMenuVisible}
        >
          {mapSearchResults
            ? (
                <MapSearchResultsWrapper>
                  <MapBreadcrumb path={mapBreadcrumbPath} />
                  {(typeView === 'district') && (
                    <>
                      <DistrictCard district={mapSearchResults as TypeDistrictExtended} logo={districtLogo} />
                      <DistrictMicroToponymList district={mapSearchResults as TypeDistrictExtended} />
                    </>
                  )}

                  {(typeView === 'micro-toponym') && (
                    <>
                      <MicroToponymCard microToponym={mapSearchResults as TypeMicroToponymExtended} />
                      <MicroToponymAddressList microToponym={mapSearchResults as TypeMicroToponymExtended} />
                    </>
                  )}

                  {(typeView === 'address') && (
                    <AddressCard address={mapSearchResults as TypeAddressExtended} withCertificate={withCertificate} />
                  )}
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
