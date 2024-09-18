'use client'

import CardWrapper from '@/components/CardWrapper'
import DownloadCard from '@/components/DownloadCard'
import Section from '@/components/Section'
import { getAddressCSVLegacy, getLieuxDitsCSVLegacy, getAdressesCsvBal } from '@/lib/api-ban'
import { matomoTrackEvent } from '@/lib/matomo'
import { BANCommune } from '@/types/api-ban.types'

interface CommuneDownloadSectionProps {
  commune: BANCommune
}

export function CommuneDownloadSection({ commune }: CommuneDownloadSectionProps) {
  function matomoTrackDownload(eventName: string) {
    return () => {
      matomoTrackEvent('Download (Front)', eventName, `${commune.codeCommune} - ${commune.nomCommune} - current`, 1)
    }
  }

  return (
    <Section title="Télécharger les adresses de la commune">
      <p>
        Voici les adresses de la communes dans la Base Adresse Nationale. Ce fichier de référence présente la liste des voies avec les libellés enrichis (minuscules accentuées), mais aussi les libellés à la norme AFNOR, les codes FANTOIR mis à jour par la DGFiP, les points adresses géocodés, ainsi que leur lien avec les parcelles s’ils sont renseignés, la source des adresses et leur certification. Pour plus d’information sur la structure des informations, consultez la documentation des fichiers de la Base Adresse Nationale.
      </p>
      <CardWrapper isSmallCard style={{ marginBottom: '2rem' }}>
        <DownloadCard title="Télécharger Format BAL 1.3" fileDescription="Fichier CSV" downloadlink={getAdressesCsvBal(commune.codeCommune, '1.3')} onDownloadStart={matomoTrackDownload('Download BAL 1.3')} />
        <DownloadCard title="Télécharger Format BAL 1.4" fileDescription="Fichier CSV" downloadlink={getAdressesCsvBal(commune.codeCommune, '1.4')} onDownloadStart={matomoTrackDownload('Download BAL 1.4')} />
        <DownloadCard title="Télécharger Format Historique" fileDescription="Fichier CSV" downloadlink={getAddressCSVLegacy(commune.codeCommune)} onDownloadStart={matomoTrackDownload('Download CSV historique adresses')} />
        <DownloadCard title="Télécharger Format Historique lieu-dit" fileDescription="Fichier CSV" downloadlink={getLieuxDitsCSVLegacy(commune.codeCommune)} onDownloadStart={matomoTrackDownload('Download CSV historique lieux-dits')} />
      </CardWrapper>
      <p>
        La commune est l’échelon de compétence pour mettre à jour les adresses. En cas de problème d’adresse sur la commune, contactez la. Vous pouvez également lui indiquer notre contact (<a href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</a>) au besoin.
      </p>
    </Section>
  )
}
