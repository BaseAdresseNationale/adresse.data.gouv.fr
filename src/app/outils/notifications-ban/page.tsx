'use client'

import React from 'react'
import Link from 'next/link'
import Section from '@/components/Section'
import WebhookGuide from '@/components/NotificationsBAN/WebhookGuide'
import useClientSidePageTitle from '@/utils/useClientSidePageTitle'
import Breadcrumb from '@/layouts/Breadcrumb'

export default function NotificationsBANPage() {
  useClientSidePageTitle('Notifications')
  return (
    <>
      <Breadcrumb
        currentPageLabel="Notifications BAN"
        segments={[{ label: 'Outils & API', linkProps: { href: '/outils' } }]}
      />
      <Section title="Notifications BAN">
        <div className="fr-container fr-py-4w">
        <div className="fr-background-contrast--grey fr-p-3w fr-mb-4w">
          <p className="fr-text--lg fr-text--bold fr-mb-0">
            La gestion de vos abonnements notifications BAN se fait depuis votre espace{' '}
            <Link href="/admin#mon_compte" className="fr-link">
              Mon compte
            </Link>.
          </p>
        </div>

        <div className="fr-mt-6w">
          <WebhookGuide alwaysExpanded />
        </div>
      </div>
      </Section>
    </>
  )
}
