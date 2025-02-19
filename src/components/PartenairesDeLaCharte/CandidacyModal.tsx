'use client'

import { useState } from 'react'
import CandidacyInfos from './CandidacyInfos'
import CandidacyForm from './CandidacyForm'
import { Departement } from '@/types/api-geo.types'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen'
import Button from '@codegouvfr/react-dsfr/Button'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'

interface CandidacyModalProps {
  services: string[]
  departements: Departement[]
  buttonLabel?: string
  defaultType?: PartenaireDeLaCharteTypeEnum
}

const Modal = createModal({
  id: 'candidate-to-partner-modal',
  isOpenedByDefault: false,
})

function CandidacyModal({ services, departements, buttonLabel = 'Rejoignez-nous', defaultType }: CandidacyModalProps) {
  const [showForm, setShowForm] = useState(false)
  useIsModalOpen(Modal, {
    onDisclose: () => setShowForm(false),
    onConceal: () => setShowForm(false),
  })

  return (
    <>
      <Button
        iconId="fr-icon-questionnaire-line"
        iconPosition="right"
        priority="secondary"
        onClick={() => Modal.open()}
        size="large"
      >
        {buttonLabel}
      </Button>
      <Modal.Component title={showForm ? 'Formulaire de candidature à la charte' : 'Notice d\'information'}>
        {showForm ? <CandidacyForm onClose={() => Modal.close()} services={services} departements={departements} defaultType={defaultType} /> : <CandidacyInfos onConfirm={() => setShowForm(true)} />}
      </Modal.Component>
    </>
  )
}

export default CandidacyModal
