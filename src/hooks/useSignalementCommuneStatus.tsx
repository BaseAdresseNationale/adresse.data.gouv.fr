import { getSignalementCommuneStatus } from '@/lib/api-signalement'
import { SignalementCommuneStatus } from '@/types/api-signalement.types'
import { useEffect, useState } from 'react'

export const useSignalementCommuneStatus = (address: { commune: TypeDistrict }
) => {
  const [signalementCommuneStatus, setSignalementCommuneStatus] = useState<SignalementCommuneStatus>({
    disabled: true,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const communeStatus = await getSignalementCommuneStatus(address.commune.code)
        setSignalementCommuneStatus(communeStatus)
      }
      catch (error) {
        console.error(`Failed to fetch signalement commune status for ${address.commune.code}`, error)
        setSignalementCommuneStatus({
          disabled: true,
          message: 'Erreur lors de la récupération du statut de signalement pour cette commune.',
        })
      }
    }

    fetchData()
  }, [address])

  return {
    disabled: signalementCommuneStatus.disabled,
    disabledMessage: signalementCommuneStatus.message,
  }
}
