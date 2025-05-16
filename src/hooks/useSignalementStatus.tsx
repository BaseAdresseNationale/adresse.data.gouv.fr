import Loader from '@/components/Loader'
import { getCurrentRevision } from '@/lib/api-depot'
import { isSignalementDisabledForCommune } from '@/lib/api-signalement'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export enum SignalementStatus {
  DISABLED_ASSEMBLAGE = 'DISABLED_ASSEMBLAGE',
  DISABLED_PARTENAIRE = 'DISABLED_PARTENAIRE',
  DISABLED_COMMUNE = 'DISABLED_COMMUNE',
  DISABLED_TECHNICAL = 'DISABLED_TECHNICAL',
  ENABLED = 'ENABLED',
}

const ObjectIdRE = new RegExp('^[0-9a-fA-F]{24}$')

const getDisabledMessage = (status: SignalementStatus | null, mairiePageURL: string | null) => {
  switch (status) {
    case SignalementStatus.DISABLED_ASSEMBLAGE:
      return (
        <>
          Les signalements ne peuvent pas être proposés sur cette commune car elle n&apos;a pas publié sa Base Adresse Locale.
          Nous vous recommandons de contacter directement la <Link className="fr-link" href={mairiePageURL || ''} target="_blank">mairie</Link>.
        </>
      )
    case SignalementStatus.DISABLED_PARTENAIRE:
      return (
        <>
          Cette commune ne gère pas encore la prise en compte des signalements depuis notre site.
          Nous vous recommandons de contacter directement la <Link className="fr-link" href={mairiePageURL || ''} target="_blank">mairie</Link>.
        </>
      )
    case SignalementStatus.DISABLED_COMMUNE:
      return (
        <>
          Cette commune a demandé la désactivation du dépôt de signalements depuis notre site.
          Nous vous recommandons de contacter directement la <Link className="fr-link" href={mairiePageURL || ''} target="_blank">mairie</Link>.
        </>
      )
    case SignalementStatus.DISABLED_TECHNICAL:
      return (
        <>
          Une erreur technique est survenue lors de la récupération d&apos;informations de la commune.
          Merci de réessayer plus tard ou de contacter directement la <Link className="fr-link" href={mairiePageURL || ''} target="_blank">mairie</Link>.
        </>
      )
    default:
      return <Loader />
  }
}

export const useSignalementStatus = (address: { commune: TypeDistrict }, mairiePageURL: string | null
) => {
  const [status, setStatus] = useState<SignalementStatus | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const isCommuneDisabled = await isSignalementDisabledForCommune(address.commune.code)
        if (isCommuneDisabled) {
          setStatus(SignalementStatus.DISABLED_COMMUNE)
          return
        }
      }
      catch (error) {
        setStatus(SignalementStatus.DISABLED_TECHNICAL)
        console.error('Error fetching communes disabled settings:', error)
        return
      }

      try {
        const currentRevision = await getCurrentRevision(address.commune.code)
        if (currentRevision?.context.extras?.balId
          && ObjectIdRE.test(currentRevision.context.extras.balId)) {
          setStatus(SignalementStatus.ENABLED)
        }
        else {
          setStatus(SignalementStatus.DISABLED_PARTENAIRE)
        }
      }
      catch {
        setStatus(SignalementStatus.DISABLED_ASSEMBLAGE)
      }
    }

    fetchData()
  }, [address])

  return {
    disabled: status !== SignalementStatus.ENABLED,
    disabledMessage: getDisabledMessage(status, mairiePageURL),
  }
}
