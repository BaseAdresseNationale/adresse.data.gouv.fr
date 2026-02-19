'use client'

import { BANCommune } from '@/types/api-ban.types'
import Section from '../Section'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Link from 'next/link'

function CommuneAdministration(_district: BANCommune) {
  return (
    <Section
      title={(<>Administration <Badge noIcon severity="info">BETA</Badge></>)}
      theme="grey"
    >
      <div>
        La gestion des options de la commune se fait par votre Espace{' '}
        <Link href="/admin#ma_commune" className="fr-link">
          Ma Commune
        </Link>
      </div>
    </Section>
  )
}

export default CommuneAdministration
