'use client'

import CardWrapper from '@/components/CardWrapper'
import DownloadCard from '@/components/DownloadCard'
import Section from '@/components/Section'
import { getAddressCSVLegacy, getAdressesCsvBal } from '@/lib/api-ban'
import { getCurrentRevisionDownloadUrl } from '@/lib/api-depot'
import { matomoTrackEvent } from '@/lib/matomo'
import { BANCommune } from '@/types/api-ban.types'
import Table from '@codegouvfr/react-dsfr/Table'

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
      {/* Temp : POC pour les délibérations commune de Saint-Benoit */ }
      {commune.codeCommune === '97410' && (
        <Table
          caption="Délibérations"
          headers={[
            'Voie(s) concernée(s)',
            'Date de la délibération',
            'Télécharger',
          ]}
          data={[
            ['Square Jean Cariou', '27/01/2025', <a className="fr-btn" key="square-sainte-anne" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/27-01-2025_square-sainte-anne.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            [<ul key="chemin-cecilia"><li>Chemin Cécilia</li><li>Chemin des agriculteurs</li></ul>, '27/01/2025', <a className="fr-btn" key="chemin-cecilia" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/27-01-2025_chemin-cecilia.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            ['Chemin Koilou', '19/06/2025', <a className="fr-btn" key="chemin-koilou" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/19-06-2025_chemin-koilou.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            ['Rue Daubenberger', '01/12/2025', <a className="fr-btn" key="rue-daubenberger" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/01-12-2025_rue-daubenberger.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            [<ul key="rue-du-saro"><li>Rue du Saro</li><li>Impasse Ravintsara</li></ul>, '21/03/2024', <a className="fr-btn" key="rue-du-saro" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/21-03-2024_rue-du-saro.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            [<ul key="rue-gapy"><li>Rue Gapy</li><li>Rue Dano</li></ul>, '21/03/2024', <a className="fr-btn" key="rue-gapy" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/21-03-2024_rue-gapy.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            ['Impasse Raphaël Bouyer', '04/09/2024', <a className="fr-btn" key="impasse-raphael-bouyer" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/04-09-2024_impasse-raphael-bouyer.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            [<ul key="rue-du-rucher"><li>Rue du Rucher</li><li>Rue des Abeilles</li></ul>, '27/09/2023', <a className="fr-btn" key="rue-du-rucher" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/27-09-2023_rue-du-rucher.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            [<ul key="impasse-bilimbli"><li>Impasse Bilimbli</li><li>Rue des Conflores</li><li>Rue des Kalbass</li><li>Rue des Ananas</li></ul>, '30/09/2023', <a className="fr-btn" key="impasse-bilimbli" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/30-09-2022_impasse-bilimbli.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
            [<ul key="impasse-papangue"><li>Impasse Papangue</li><li>Rue de la Liberté</li></ul>, '27/01/2022', <a className="fr-btn" key="impasse-papangue" href="https://base-adresse-locale-static-files.s3.fr-par.scw.cloud/97410/21-05-2022_impasse-papangue.pdf" download><span className="fr-icon-download-line" aria-hidden="true" /></a>],
          ]}
        />
      )}
    </Section>
  )
}

export default CommuneDownloadSection
