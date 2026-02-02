'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import type { TabsProps } from "@codegouvfr/react-dsfr/Tabs";

import Section from '@/components/Section'
import Breadcrumb from '@/layouts/Breadcrumb'

import DistrictAdmin from './components/DistrictAdmin';
import MandatoryAdmin from './components/MandatoryAdmin';
import AccountAdmin from './components/AccountAdmin';
import SignInBlock from './components/DistrictActions/SignInBlock'

// TODO: Move to a shared hooks file ?
const useHash = () => {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
  );
  const [hashInitialized, setHashInitialized] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.replace('#', ''));
    };

    window.addEventListener('hashchange', handleHashChange);
    setHashInitialized(true);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return { hash, hashInitialized };
};

const tabsDescriptions = {
  mon_compte: {
    label: "Mon compte",
    iconId: "fr-icon-user-fill",
    content: AccountAdmin,
  },
  mes_mandats: {
    label: "Mes mandats",
    iconId: "ri-pin-distance-fill",
    content: MandatoryAdmin,
  },
  ma_commune: {
    label: "Ma commune",
    iconId: "ri-map-pin-2-fill",
    content: DistrictAdmin,
  },
} as const satisfies Record<string, { label: string; iconId: TabsProps["tabs"][number]["iconId"]; content: React.ComponentType<any> }>;

type ControlledTabs = Extract<TabsProps, { selectedTabId: string }>["tabs"];
const tabDefinitions: ControlledTabs = Object.entries(tabsDescriptions)
  .map(([tabId, {label, iconId}]) => ({
    tabId,
    label,
    iconId,
  }));

type TabId = keyof typeof tabsDescriptions;
const isTabId = (value: string): value is TabId => value in tabsDescriptions;

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const { hash, hashInitialized } = useHash()
  const searchParams = useSearchParams()
  const [selectedTab, setSelectedTab] = useState<TabId>((hash as TabId) || (tabDefinitions[0].tabId as TabId))

  useEffect(() => {
    if (hash && isTabId(hash)) {
      setSelectedTab(hash);
    } else {
      setSelectedTab(tabDefinitions[0].tabId as TabId);
    }
  }, [hash]);


  const tabNavigation = useCallback(
    (tabId: TabId) => {
      if (typeof window !== 'undefined') {
        setSelectedTab(tabId)
        router.push(`${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}#${tabId}`, { scroll: false })
      }
    },
    [router, pathname, searchParams]
  )

  const isUserConnected = true // TODO: Replace with actual user connection status

  // TODO: Load required props for each tab ?
  const props: Record<TabId, any> = {
    mon_compte: {},
    mes_mandats: {},
    ma_commune: {
      config: {},
      onUpdateConfig: (newConfig: any) => console.log('New Config:', newConfig),
    },
  }

  return (
    <>
      <Breadcrumb
        currentPageLabel="Administration"
        segments={[]}
      />
      <Section>
        <div>
          {
            isUserConnected ? (
              hashInitialized ? (
                <Tabs
                  onTabChange={(tabId: string) => tabNavigation(tabId as TabId)}
                  selectedTabId={selectedTab}
                  tabs={tabDefinitions}
                >
                  {React.createElement(tabsDescriptions[selectedTab]?.content as React.ComponentType<any>, props[selectedTab])}
                </Tabs>
              ) : (<p>Chargement...</p>
              )
            ) : (
              <SignInBlock />
            )
          }
            </div>
      </Section>
    </>
  )
}
