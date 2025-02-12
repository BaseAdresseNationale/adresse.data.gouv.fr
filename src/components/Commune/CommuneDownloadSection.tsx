'use client'

import CardWrapper from '@/components/CardWrapper'
import DownloadCard from '@/components/DownloadCard'
import Section from '@/components/Section'
import { getAddressCSVLegacy, getAdressesCsvBal } from '@/lib/api-ban'
import { getCurrentRevisionDownloadUrl } from '@/lib/api-depot'
import { matomoTrackEvent } from '@/lib/matomo'
import { BANCommune } from '@/types/api-ban.types'

interface CommuneDownloadSectionProps {
  commune: BANCommune
  hasRevision?: boolean
}

export function CommuneDownloadSection({ commune, hasRevision }: CommuneDownloadSectionProps) {
  function matomoTrackDownload(eventName: string) {
    return () => {
      matomoTrackEvent('Download (Front)', eventName, `${commune.codeCommune} - ${commune.nomCommune} - current`, 1)
    }
  }

  return (
    <Section title="Téléchargements" theme="primary">
      <CardWrapper style={{ marginBottom: '2rem' }}>

        {hasRevision
          ? (
              <DownloadCard
                title="Format Local (BAL)"
                text={(
                  <div style={{ fontSize: '0.8rem' }}>
                    Adresses diffusées par la commune
                  </div>
                )}
                fileDescription="Fichier CSV"
                downloadlink={getCurrentRevisionDownloadUrl(commune.codeCommune)}
                onDownloadStart={matomoTrackDownload('Download format BA')}
              />
            )
          : (
              <DownloadCard
                title="Format Local (BAL)"
                text={(
                  <div style={{ fontSize: '0.8rem' }}>
                    Format BAL 1.4 généré à partir de l&apos;assemblage BAN
                  </div>
                )}
                fileDescription="Fichier CSV"
                downloadlink={getAdressesCsvBal(commune.codeCommune, '1.4')}
                onDownloadStart={matomoTrackDownload('Download BAL 1.4')}
              />
            )}

        <DownloadCard
          title="Format national (BAN)"
          text={(
            <div style={{ fontSize: '0.8rem' }}>Inclut des colonnes additionnelles
              <ul style={{ lineHeight: 1.2 }}>
                <li>Nom et code de la commune ancienne</li>
                <li>Libellé AFNOR</li>
                <li>Libellé d&apos;acheminement</li>
                <li>Code Postal</li>
              </ul>
            </div>
          )}
          fileDescription="Fichier CSV"
          downloadlink={getAddressCSVLegacy(commune.codeCommune)}
          onDownloadStart={matomoTrackDownload('Download CSV historique adresses')}
        />

        <DownloadCard
          title="Liste des voies et des lieux-dits (odonymes)"
          text={(
            <div style={{ fontSize: '0.8rem' }}>
              Utile pour commander des panneaux ou prendre une délibération groupée
            </div>
          )}
          fileDescription="Fichier CSV"
          downloadlink={`/api/downloads/${commune.codeCommune}/street-list?from=${hasRevision ? 'api-depot' : 'ban'}`}
          onDownloadStart={matomoTrackDownload('Download street list')}
        />
      </CardWrapper>
    </Section>
  )
}
