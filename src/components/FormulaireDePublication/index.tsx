'use client'

import Section from '@/components/Section'
import { Stepper } from '@codegouvfr/react-dsfr/Stepper'
import { useEffect, useState } from 'react'
import DropZoneInput from '@/components/DropZoneInput'
import { StyledWrapper } from './FormulaireDePublication.styles'
import Loader from '@/components/Loader'
import { validate } from '@ban-team/validateur-bal'
import { getCommune } from '@/lib/api-geo'
import { Commune } from '@/types/api-geo.types'
import { validateHabilitationPinCode, createHabilitation, createRevision, getHabilitation, sendHabilitationPinCode, getCurrentRevision, publishRevision } from '@/lib/api-depot'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Image from 'next/image'
import { getCommuneFlagProxy } from '@/lib/api-blasons-communes'
import { HabilitationMethod } from './steps/HablitationMethod'
import { Habilitation, HabilitationStatus, Revision } from '@/types/api-depot.types'
import { PinCodeValidation } from './steps/PinCodeValidation'
import { PublishingBAL } from './steps/PublishingBAL'
import { PublishedBAL } from './steps/PublishedBAL'
import Link from 'next/link'

const getStepIndex = (revision?: Revision, habilitation?: Habilitation) => {
  if (revision && habilitation) {
    if (revision.status === 'published' && revision.isCurrent) {
      // La révision est publiée, fin du formulaire
      return 4
    }

    if (habilitation.status === HabilitationStatus.ACCEPTED) {
      // Habilitation obtenue, on affiche la confirmation de publication
      return 3
    }

    if (revision.isReady && habilitation.status === HabilitationStatus.PENDING) {
      // Code envoyé par email, on affiche le champ de saisi
      if (habilitation?.strategy?.type === 'email') {
        return 2
      }

      // Sélection de la méthode d'authentification
      return 1
    }
  }

  // Dépôt du fichier
  return 0
}

interface FormulaireDePublicationProps {
  initialCommune?: Commune & { flagUrl: string }
  initialRevision?: Revision
  initialHabilitation?: Habilitation
}

export default function FormulaireDePublication({ initialHabilitation, initialRevision, initialCommune }: FormulaireDePublicationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [commune, setCommune] = useState<Commune & { flagUrl: string } | undefined>(initialCommune)
  const [habilitation, setHabilitation] = useState<Habilitation | undefined>(initialHabilitation)
  const [revision, setRevision] = useState<Revision | undefined>(initialRevision)
  const [communeCurrentRevision, setCommuneCurrentRevision] = useState<Revision>()

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const step = getStepIndex(revision, habilitation)
    if (step !== stepIndex) {
      setStepIndex(step)
      setError(undefined)
    }
  }, [revision, habilitation, stepIndex])

  const handleFileChange = async (file?: File) => {
    if (!file) {
      throw new Error('No file selected')
    }
    try {
      setIsLoading(true)
      const report = await validate(file, { profile: '1.3' })
      if (!report.parseOk) {
        throw new Error(`Impossible d’analyser le fichier… [${report.parseErrors[0].message}]`)
      }
      else if (!report.profilesValidation['1.3'].isValid) {
        throw new Error('Le fichier n\'est pas valide en version 1.3, veuillez corriger les erreurs en utilsant le Validateur BAL (Les Outils -> Validateur BAL) puis essayez à nouveau.')
      }
      const communes = new Set<string>(Array.from(report.rows.map((r: any) => r.parsedValues.commune_insee || r.additionalValues.cle_interop.codeCommune)))

      if (communes.size !== 1) {
        throw new Error('Fichier BAL vide ou contenant plusieurs communes')
      }

      const [codeCommune] = communes
      const commune = await getCommune(codeCommune)
      const communeFlagUrl = await getCommuneFlagProxy(codeCommune)

      const habilitation = await createHabilitation(codeCommune)
      setHabilitation(habilitation)

      const revision = await createRevision(codeCommune, file) // Gérer le cas où la révision n'est pas valide
      setRevision(revision)

      try {
        const currentRevision = await getCurrentRevision(codeCommune)
        setCommuneCurrentRevision(currentRevision)
      }
      catch (e) {
        setError(e as Error)
      }

      setCommune({ ...commune, flagUrl: communeFlagUrl })
    }
    catch (e) {
      setError(e as Error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const sendPinCode = async () => {
    try {
      if (!habilitation) {
        throw new Error('Une erreur est survenue')
      }
      setIsLoading(true)
      await sendHabilitationPinCode(habilitation.id)
      const updatedHabilitation = await getHabilitation(habilitation.id)
      setHabilitation(updatedHabilitation)
    }
    catch (error) {
      setError(error as Error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const checkPinCode = async (pinCode: string) => {
    try {
      if (!habilitation) {
        throw new Error('Une erreur est survenue')
      }
      setIsLoading(true)
      await validateHabilitationPinCode(habilitation.id, pinCode)
      const updatedHabilitation = await getHabilitation(habilitation.id)
      setHabilitation(updatedHabilitation)
    }
    catch (error) {
      setError(error as Error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handlePublishRevision = async () => {
    try {
      if (!habilitation || !revision) {
        throw new Error('Une erreur est survenue')
      }
      setIsLoading(true)
      const publishedRevision = await publishRevision(revision.id, JSON.stringify({
        habilitationId: habilitation.id,
      }))
      setRevision(publishedRevision)
    }
    catch (error) {
      setError(error as Error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setCommune(undefined)
    setHabilitation(undefined)
    setRevision(undefined)
    setCommuneCurrentRevision(undefined)
    setStepIndex(0)
  }

  const steps = [
    { title: 'Dépôt du fichier BAL', content: (
      <DropZoneInput
        onChange={handleFileChange}
        label="Déposer ou cliquer ici pour télécharger votre fichier BAL à publier"
        hint="Taille maximale: 50 Mo. Format supporté : CSV"
        accept={{ 'text/csv': [], 'application/vnd.ms-excel': [] }}
        maxSize={50 * 1024 * 1024}
      />
    ) },
    { title: 'Choix de la méthode d\'habilitation', content: (revision && habilitation) && <HabilitationMethod revision={revision} habilitation={habilitation} sendPinCode={sendPinCode} /> },
    { title: 'Validation de l\'habilitation', content: habilitation && <PinCodeValidation habilitation={habilitation} onSubmit={checkPinCode} sendPinCode={sendPinCode} isLoading={isLoading} /> },
    { title: 'Publication des adresses', content: commune && <PublishingBAL commune={commune} handlePublishRevision={handlePublishRevision} hasConflict={Boolean(communeCurrentRevision)} /> },
    { title: 'La Base Adresse Locale est publiée', content: commune && <PublishedBAL commune={commune} onReset={handleReset} /> },

  ]

  return (
    <Section pageTitle="Formulaire de publication">
      <Stepper currentStep={stepIndex + 1} stepCount={steps.length} title={steps[stepIndex].title} nextTitle={steps[stepIndex + 1]?.title} />
      {error && <Alert title="Une erreur est survenue" severity="error" description={error.message} />}
      <StyledWrapper>
        {(stepIndex > 0 && commune) && (
          <Link href={`/commune/${commune.code}`} className="commune-link">
            <Image width={80} height={80} alt="logo commune par défault" src={commune.flagUrl} />
            <b>{commune.nom} - {commune.code}</b>
          </Link>
        )}
        {isLoading ? <Loader style={{ alignSelf: 'center' }} /> : steps[stepIndex].content}
      </StyledWrapper>
      {habilitation?.status === HabilitationStatus.REJECTED && <Alert title="Erreur" severity="error" description="Votre demande d’habilitation a été rejetée." />}
    </Section>
  )
}
