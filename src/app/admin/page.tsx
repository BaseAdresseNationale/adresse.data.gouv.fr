'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import type { TabsProps } from '@codegouvfr/react-dsfr/Tabs'
import Badge from '@codegouvfr/react-dsfr/Badge'

import Section from '@/components/Section'
import Breadcrumb from '@/layouts/Breadcrumb'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/Loader'
import LogoutProConnectButtonCustom from '@/components/LogoutProConnectButtonCustom/LogoutProConnectButtonCustom'

import DistrictAdmin from './components/DistrictAdmin'
import MandatoryAdmin from './components/MandatoryAdmin'
import AccountAdmin from './components/AccountAdmin'
import SignInBlock from './components/DistrictActions/SignInBlock'

import { getCommunesBySiren } from '@/lib/api-geo'
import { getCommuneWithoutCache } from '@/lib/api-ban'
import { BANCommune } from '@/types/api-ban.types'
import { Commune } from '@/types/api-geo.types'

// TODO: Move to a shared hooks file ?
const useHash = () => {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
  )
  const [hashInitialized, setHashInitialized] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.replace('#', ''))
    }

    window.addEventListener('hashchange', handleHashChange)
    setHashInitialized(true)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return { hash, hashInitialized }
}

const tabsDescriptions = {
  mon_compte: {
    label: 'Mon compte',
    iconId: 'fr-icon-user-fill',
    content: AccountAdmin,
  },
  // Temporairement désactivé - à réactiver plus tard
  // mes_mandats: {
  //   label: 'Mes mandats',
  //   iconId: 'ri-pin-distance-fill',
  //   content: MandatoryAdmin,
  // },
  ma_commune: {
    label: 'Ma commune',
    iconId: 'ri-map-pin-2-fill',
    content: DistrictAdmin,
  },
} as const satisfies Record<string, { label: string, iconId: TabsProps['tabs'][number]['iconId'], content: React.ComponentType<any> }>

// Temporairement désactivé - à réactiver plus tard
// const tabsDescriptionsWithMandats = {
//   ...tabsDescriptions,
//   mes_mandats: {
//     label: 'Mes mandats',
//     iconId: 'ri-pin-distance-fill',
//     content: MandatoryAdmin,
//   },
// }

type ControlledTabs = Extract<TabsProps, { selectedTabId: string }>['tabs']
const tabDefinitions: ControlledTabs = Object.entries(tabsDescriptions)
  .filter(([tabId]) => tabId !== 'mes_mandats') // Temporairement désactivé
  .map(([tabId, { label, iconId }]) => ({
    tabId,
    label,
    iconId,
  }))

type TabId = keyof typeof tabsDescriptions
const isTabId = (value: string): value is TabId => value in tabsDescriptions

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const { hash, hashInitialized } = useHash()
  const searchParams = useSearchParams()
  const { authenticated, userInfo, loading } = useAuth()
  const [selectedTab, setSelectedTab] = useState<TabId>((hash as TabId) || (tabDefinitions[0].tabId as TabId))
  const [district, setDistrict] = useState<BANCommune | null>(null)
  const [commune, setCommune] = useState<Commune | null>(null)
  const [loadingDistrict, setLoadingDistrict] = useState<boolean>(false)
  const [sessionInitialized, setSessionInitialized] = useState(false)
  const [sessionError, setSessionError] = useState<string>('')

  useEffect(() => {
    if (authenticated && userInfo && !sessionInitialized) {
      const initSession = async () => {
        try {
          const response = await fetch('/api/proconnect-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo),
          })

          if (!response.ok) {
            throw new Error('Erreur lors de l\'initialisation de la session')
          }

          setSessionInitialized(true)
          setSessionError('')
        }
        catch (e) {
          console.error('Failed to init session', e)
          setSessionError('Impossible d\'initialiser la session. Certaines fonctionnalités peuvent être indisponibles.')
        }
      }
      initSession()
    }
  }, [authenticated, userInfo, sessionInitialized])

  useEffect(() => {
    if (hash && isTabId(hash)) {
      setSelectedTab(hash)
    }
    else {
      setSelectedTab(tabDefinitions[0].tabId as TabId)
    }
  }, [hash])

  const fetchDistrict = useCallback(async () => {
    if (authenticated && userInfo?.siret) {
      setLoadingDistrict(true)
      try {
        const siren = userInfo.siret.substring(0, 9)
        const communes = await getCommunesBySiren(siren)
        if (communes && communes.length > 0) {
          const commune = communes[0] // Assume first one for now
          const banCommune = await getCommuneWithoutCache(commune.code)
          setDistrict(banCommune)
          setCommune(commune)
        }
      }
      catch (error) {
        console.error('Error fetching district:', error)
        setDistrict(null)
        setCommune(null)
      }
      finally {
        setLoadingDistrict(false)
      }
    }
  }, [authenticated, userInfo?.siret])

  useEffect(() => {
    fetchDistrict()
  }, [fetchDistrict])

  const tabNavigation = useCallback(
    (tabId: TabId) => {
      if (typeof window !== 'undefined') {
        setSelectedTab(tabId)
        router.push(`${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}#${tabId}`, { scroll: false })
      }
    },
    [router, pathname, searchParams]
  )

  const props: Partial<Record<TabId, any>> = {
    mon_compte: {
      userInfo: userInfo,
    },
    // Temporairement désactivé - à réactiver plus tard
    // mes_mandats: {},
    ma_commune: {
      district: district,
      commune: commune,
      config: district?.config || {},
      onUpdateConfig: (newConfig: any) => {
        setDistrict((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            config: newConfig,
          }
        })
      },
      readOnly: loadingDistrict || !district,
      loading: loadingDistrict,
      userInfo: userInfo,
    },
  }

  if (loading) {
    return (
      <>
        <Breadcrumb
          currentPageLabel="Administration"
          segments={[]}
        />
        <Section>
          <div className="fr-container fr-container--fluid">
            <div className="fr-grid-row fr-grid-row--center fr-grid-row--middle" style={{ minHeight: '400px' }}>
              <div className="fr-col-auto">
                <Loader size={50} />
              </div>
            </div>
          </div>
        </Section>
      </>
    )
  }

  return (
    <>
      <Breadcrumb
        currentPageLabel="Administration"
        segments={[]}
      />
      <Section>
        <div className="fr-mb-3w">
          <h2 className="fr-mb-0">
            Espace administration{' '}
            <Badge noIcon severity="info">BETA</Badge>
          </h2>
        </div>
        {sessionError && (
          <div className="fr-mb-3w">
            <div className="fr-alert fr-alert--warning fr-alert--sm">
              <p>{sessionError}</p>
            </div>
          </div>
        )}
        <div>
          {
            authenticated
              ? (
                  hashInitialized
                    ? (
                        <Tabs
                          onTabChange={(tabId: string) => tabNavigation(tabId as TabId)}
                          selectedTabId={selectedTab}
                          tabs={tabDefinitions}
                        >
                          {React.createElement(tabsDescriptions[selectedTab]?.content as React.ComponentType<any>, props[selectedTab])}
                        </Tabs>
                      )
                    : (<p>Chargement...</p>
                      )
                )
              : (
                  <SignInBlock />
                )
          }
        </div>
      </Section>
    </>
  )
}
